var express = require('express');
var router = express.Router();
const requireLogin = require('./middleware/requireLogin');
const {mongo,admins} = require('../helper');
const random = require('randomstring');

const fetch = require('node-fetch');

const setSessionReturn = require('./middleware/setSessionReturn')

router.get('/identities', requireLogin, async(req, res) => {

  const user = await mongo.User.findOne({user_id: req.session.user.user_id})
  const identities = await mongo.HiveAccount.find({user_id: user._id});
  res.render('new/settings/identities', {
    isAdmin: admins.includes(req.session.user.user_id),
    identities
  })

})

router.get('/identities/add', requireLogin, (req, res) => {

  return res.redirect(`${APP_PAGE_PROTOCOL}://${APP_STUDIO_DOMAIN}/identities`)

})

router.get('/language', setSessionReturn, requireLogin, async(req, res) => {

  const languages = await mongo.Language.find();
  let settings = await mongo.LanguageSetting.findOne({userId: req.user.user_id});

  if (settings === null) {

    settings = new mongo.LanguageSetting({
      userId: req.user.user_id
    });

    await settings.save()

  }


  settings.info = req.query.i;

  res.render('new/settings/language', {settings, languages});

});

router.post('/language', setSessionReturn, requireLogin, async(req, res) => {

  const settings = await mongo.LanguageSetting.findOne({userId: req.user.user_id});

  if (settings === null) {

    return res.redirect('/settings/language');

  }

  const languages = req.body.languages;
  settings.languages = languages;

  await settings.save();
  return res.redirect('/settings/language?i=success');

});


module.exports = router;
