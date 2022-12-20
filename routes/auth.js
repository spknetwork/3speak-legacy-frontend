const { config } = require("../config/index.js");
var express = require('express');
var router = express.Router();
var {mongo, admins, cognito, hiveHelper} = require('../helper');
var jwt = require('jsonwebtoken');
const requireLogin = require('./middleware/requireLogin');
const randomstring = require('randomstring');
const hive = require('@hiveio/hive-js')
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api', 'true');
hive.broadcast.updateOperations();
const util = require('util');


router.get('/login', (req, res) => {

  res.redirect(AUTH_API_URL + '?redirect_url=' + AUTH_API_REDIRECT_URL + '&client_id=' + AUTH_API_CLIENT_ID)

});

router.get('/callback', async (req, res, next) => {

  const {access_token = null} = req.query;
  const userProfile = jwt.verify(access_token, AUTH_JWT_SECRET)

  req.session.user = userProfile

  let contentCreator = await mongo.User.findOne({user_id: userProfile.user_id});

  if (contentCreator === null) {

    contentCreator = new mongo.User({
      user_id: req.session.user.user_id,
      email: req.session.user.email
    });
    await contentCreator.save();

  }

  if (contentCreator.last_identity) {

    const lastIdentity = await mongo.HiveAccount.findOne({_id: contentCreator.last_identity});

    if (lastIdentity !== null) {

      req.session.identity = await mongo.ContentCreator.findOne({username: lastIdentity.account});

    }

  }

  res.redirect('/')

});

router.get('/logout', (req, res) => {

  req.session.end_session = true

  res.redirect('/')


});

router.get('/sso', requireLogin, async (req, res) => {

  const PLATFORMS = {
    'studio': {
      link_format: (process.env.ENV === 'dev' ? 'http://localhost:3005' : `https://${APP_STUDIO_DOMAIN}`) + '/login?access_token=%s'
    }
  }

  const {platform} = req.query;

  for (const target of Object.keys(PLATFORMS)) {

    if (target === platform) {

      const access_token = jwt.sign(req.session.user, AUTH_JWT_SECRET, {expiresIn: '30s'})
      return res.redirect(util.format(PLATFORMS[target].link_format, access_token))

    }

  }


  res.status(400).send('Bad Request')

})

router.get('/refreshIdentity', requireLogin, async (req, res) => {

  try {

    const user = await mongo.User.findOne({user_id: req.session.user.user_id})

    if (admins.includes(req.session.user.user_id)) {

      if (req.query.identity) {

        const newIdent = await mongo.ContentCreator.findOne({username: req.query.identity})

        if (newIdent !== null) {

          const identity = await mongo.HiveAccount.findOne({
            account: req.query.identity
          });

          user.last_identity = identity._id;
          await user.save();
          req.session.user = user;

          req.session.identity = newIdent

        }

      }
      return res.redirect('/')


    }
    if (req.query.identity) {

      const identity = await mongo.HiveAccount.findOne({
        user_id: user._id,
        account: req.query.identity
      });

      if (identity !== null) {

        const newIdent = await mongo.ContentCreator.findOne({username: req.query.identity})

        if (newIdent !== null) {

          user.last_identity = identity._id;
          await user.save();
          req.session.user = user;
          req.session.identity = newIdent

        }

      }

    }

    res.redirect('/')

  } catch (e) {

    res.redirect('/')

  }

})

router.post('/completeIdentityChallenge', requireLogin, async (req, res) => {

  const wif_memo = AUTH_WIF_MEMO;
  const wif_pub = AUTH_PUB_MEMO;

  const contentCreator = await mongo.User.findOne({user_id: req.session.user.user_id});

  function getUserPub(pubkeys) {

    return pubkeys.pubkey === wif_pub ? pubkeys.otherpub : pubkeys.pubkey

  }

  const {signed_message} = req.body;

  try {

    const decoded = hive.memo.decode(wif_memo, signed_message)
    const message = JSON.parse(decoded.substr(1));
    const pubKeys = hive.memo.getPubKeys(wif_memo, signed_message)

    const [account] = await hive.api.getAccountsAsync([message.account])

    let signatureValid = false;

    for (const key_auth of account[message.authority].key_auths) {

      if (key_auth[0] === getUserPub(pubKeys)) {

        signatureValid = true

      }

    }

    if (signatureValid) {

      const challenge = await mongo.HiveAccountChallenge.findOne({
        account: message.account,
        user_id: req.session.user.user_id,
        challenge: message.message,
        key: message.authority
      })

      if (challenge !== null) {

        let identity = await mongo.HiveAccount.findOne({
          account: message.account,
          user_id: contentCreator._id
        });

        if (identity === null) {

          identity = new mongo.HiveAccount({
            account: message.account,
            user_id: contentCreator._id
          });

          await identity.save();

        }

        contentCreator.last_identity = identity._id;

        let cc = await mongo.ContentCreator.findOne({username: message.account})

        if (cc !== null) {

          req.session.identity = cc

        } else {

          cc = new mongo.ContentCreator({
            username: message.account,
            hidden: false
          });
          await cc.save();
          req.session.identity = cc

        }
        // risky.

        await contentCreator.save();
        return res.json({
          success: true
        })

      }

    }

    return res.json({success: false, message: 'signature invalid'})

  } catch (e) {

    return res.json({success: false, message: 'signed message invalid'})

  }

})

router.get('/identityChallenge', requireLogin, async (req, res) => {

  const {account, authority} = req.query;
  const key = authority;
  let challenge = await mongo.HiveAccountChallenge.findOne({
    account,
    user_id: req.session.user.user_id,
    key
  })

  if (challenge === null) {

    challenge = new mongo.HiveAccountChallenge({
      account,
      key,
      user_id: req.session.user.user_id,
      challenge: randomstring.generate({
        length: 48
      })
    })
    await challenge.save();

  }

  res.json(challenge)

})


router.get('/verify', async (req, res) => {
  const {email, code} = req.query;
  const JWT_SECRET = config.authJwt;

  try {
    const data = await (await fetch(`${AUTH_API_URL}/3/verify?key=${config.bananaKey}&email=${email}&code=${code}`)).json();

    if (data.success === true) {
      try {
        const needToCreateAccount = data.data.hiveAccount !== "null";

        const userId = data.data.username;
        const email = data.data.email;

        const contentCreator = new mongo.User({
          user_id: userId,
          email: email
        });

        await contentCreator.save();

        if (needToCreateAccount) {
          const usernameToCreate = data.data.hiveAccount;
          const account = await hiveHelper.createAccountWithAuthority(usernameToCreate, ACCOUNT_CREATION_AUTHORITY_ACCOUNT, THREESPEAK_ACTIVE_WIF)

          const identity = new mongo.HiveAccount({
            account: usernameToCreate,
            user_id: contentCreator._id
          });

          await identity.save();

          contentCreator.last_identity = identity._id;
          await contentCreator.save();

          let cc = await mongo.ContentCreator.findOne({username: usernameToCreate})

          if (cc === null) {
            cc = new mongo.ContentCreator({
              username: usernameToCreate,
              hidden: false
            });
            await cc.save();
          }
        }

        const APP_ACCESS_TOKEN = jwt.sign({
          email: email,
          email_verified: true,
          user_id: userId
        }, JWT_SECRET)

        const base = process.env.ENV === 'dev' ? 'http://localhost:9400/auth/callback' : `https://${APP_PAGE_DOMAIN}/auth/callback`;

        res.redirect(base + `?access_token=${APP_ACCESS_TOKEN}`);

      } catch (e) {
        res.render('new/authorize/verify', {result: {error: e}})
      }

    } else {
      res.render('new/authorize/verify', {result: {error: {message: "This account was already confirmed."}}})
    }
  } catch (e) {
    res.render('new/authorize/verify', {result: {error: e}})
  }

})

module.exports = router;
