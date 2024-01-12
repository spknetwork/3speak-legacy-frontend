const jwt = require('jsonwebtoken')
var express = require('express');
var requireLogin = require('./middleware/requireLogin');
var getChannel = require('./middleware/getChannel');
var router = express.Router();
var hive = require('@hiveio/hive-js');
const {Client: HiveClient, PrivateKey} = require('@hiveio/dhive')
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_SECURE_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api', 'true');
hive.broadcast.updateOperations();
const hiveClient = new HiveClient(`${HIVE_SECURE_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`)
const key = PrivateKey.fromString(THREESPEAK_POSTING_WIF);


var ObjectID = require('mongodb').ObjectID;
var upvoteValue = require('./middleware/upvoteValue');
var createError = require('http-errors');
var xss = require('xss');
var fetch = require('node-fetch');
var showdown = require('showdown');
var xssFilter = require('showdown-xss-filter');
var moment = require('moment');
const isBot = require('isbot');

const scr = require('steem-content-renderer');
const helper = require('../helper');

const mongo = helper.mongo;

// milestones for achievements and achivement classes
const {milestones, postCounter, subscriberCounter, viewsCounter, milestoneCategories} = require('../scripts/milestones')

const renderer = new scr.DefaultRenderer({
  baseUrl: 'https://hive.blog/',
  breaks: true,
  skipSanitization: false,
  addNofollowToLinks: true,
  doNotShowImages: false,
  ipfsPrefix: '',
  assetsWidth: 640,
  assetsHeight: 480,
  imageProxyFn: (url) => url,
  usertagUrlFn: (account) => '/user/' + account,
  hashtagUrlFn: (hashtag) => '/search?q=' + hashtag.trim(),
  isLinkSafeFn: (url) => {

    const secureHosts = [
      'hive.blog',
      'steem.ninja',
      'steem.guru',
      'busy.org',
      'steempeak.com',
      'github.com',
      'oracle-d.com',
      'login.oracle-d.com',
      'write4.oracle-d.com',
      'cdn.steem.ninja',
      'amzn.to',
      'go.oracle-d.com',
      APP_PAGE_DOMAIN
    ];

    if (!url.startsWith('https')) {

      return false;

    }

    try {

      url = new URL(url);
      return secureHosts.includes(url.host);

    } catch (e) {

      return false

    }

  }
});
const setSessionReturn = require('./middleware/setSessionReturn');

async function emailNotificationCheck(userID, creatorName) {

  const result = await mongo.EmailNotification.findOne({userId: userID});
  let creatorId = await mongo.ContentCreator.findOne({username: creatorName});
  creatorId = creatorId._id
  creatorId = ObjectID(creatorId).toString()
  if (result === null) {

    return false

  }
  for (let i = 0; i < result.channels.length; i++) {

    const subbedchannel = result.channels[i].toString()
    if (creatorId === subbedchannel) {

      return true

    }

  }
  return false

}

var converter = new showdown.Converter({extensions: [xssFilter]});

router.get('/api/chain', async(req, res) => {

  const resp = await hive.api.getContentAsync(req.query.author, req.query.permlink);
  const info = {
    votes: resp.net_votes,
    comments: resp.children
  };

  res.json(info)

});

router.get('/api/balance', async(req, res) => {

  return res.json({balance: 0})

});

router.get('/api/:username/livestream', async(req, res) => {

  const offline = {
    title: 'Offline',
    description: 'This stream is offline.',
    channel: 'static',
    permlink: 'offline',
    status: 'vod',
    hideMenu: true
  };

  const user = await mongo.Livestream.findOne({channel: req.params.username, status: 'live'}).sort('-created');

  if (user === null) {

    res.json(offline)

  } else {

    res.json({
      title: user.title,
      description: user.description,
      channel: user.channel,
      permlink: user.permlink,
      status: user.status,
      poster: '',
      hideMenu: true
    })

  }

});

router.get('/api/livestream/view', async(req, res) => {

  if (isBot(req.headers['user-agent'])) {

    return res.json({
      success: false,
      count: await mongo.LiveView.countDocuments({
        channel: req.query.channel,
        timestamp: {$gt: moment().tz('Europe/Berlin').subtract(30, 'seconds').toDate()}
      })
    });

  }

  let view = await mongo.LiveView.find({
    channel: req.query.channel,
    userIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    timestamp: {$gt: moment().tz('Europe/Berlin').subtract(30, 'seconds').toDate()}
  });

  if (view.length === 0) {

    view = new mongo.LiveView();
    view.channel = req.query.channel;
    view.userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    view.timestamp = new Date();
    view.userAgent = req.headers['user-agent'] || 'none';
    await view.save();
    return res.json({
      success: true,
      count: await mongo.LiveView.countDocuments({
        channel: req.query.channel,
        timestamp: {$gt: moment().tz('Europe/Berlin').subtract(30, 'seconds').toDate()}
      })
    });

  }

  res.json({
    success: false,
    count: await mongo.LiveView.countDocuments({
      channel: req.query.channel,
      timestamp: {$gt: moment().tz('Europe/Berlin').subtract(30, 'seconds').toDate()}
    })
  });

});

async function subStatus(req, user) {

  const subscribed = false;
  let notifications = false;

  if (req.user) {

    notifications = await emailNotificationCheck(req.user.user_id, user.username);

  }

  return [subscribed, notifications];

}

router.get('/:username/live', setSessionReturn, async(req, res, next) => {

  const user = await mongo.ContentCreator.findOne({
    banned: false,
    username: req.params.username
  });
  if (user === null) {

    return next(createError(404));

  }

  const [subscribed, notifications] = await subStatus(req, user);

  if (user.hasProStreaming === false) {
    function getStreams(is247 = false) {

      return new Promise((resolve, reject) => {

        let url = `${APP_PAGE_PROTOCOL}://${APP_LIVE_DOMAIN}/list`;

        if (is247) {

          url += '247'

        }

        fetch(url)
          .then(res => res.json())
          .then(body => {

            resolve(body)

          })
          .catch(() => {

            resolve([])

          })

      });

    }


    const stream = await mongo.Livestream.findOne({channel: req.params.username});

    let streams = await getStreams(stream !== null ? stream.is247 : false);

    streams = streams.map(x => x.split('_')[1])
    let isLive = false
    if (streams.includes(req.params.username)) {

      isLive = true

    }


    res.render('new/live', {
      channel: user,
      subscribed,
      lsTitle: stream === null ? 'Livestream by: ' + req.params.username : stream.title,
      notifications,
      chatToken: req.session.user && req.session.identity && req.session.identity.nickname ? jwt.sign({
        nickname: req.session.identity.nickname,
        userid: req.session.user.user_id
      }, require('fs').readFileSync(__dirname + '/../helper/jwt.secret').toString()) : '',
      active_menu: 'live',
      noTopAd: true,
      hideMenu: true,
      isLive,
      is247: stream === null ? false : stream.is247,
      noHeaderImage: true
    })
  } else {
    async function getStream() {

      try {
        const data = await (await fetch('https://live-pro.3speak.co/status?name=' + req.params.username)).json();
        return data;
      } catch (e) {
        return {}
      }

    }


    const stream = await mongo.Livestream.findOne({channel: req.params.username});

    const streamData = await getStream();
    let isLive = streamData.broadcasting === true;

    console.log('LIVE PRO')
    res.render('new/livePro', {
      channel: user,
      subscribed,
      lsTitle: stream === null ? 'Livestream by: ' + req.params.username : stream.title,
      notifications,
      chatToken: req.session.user && req.session.identity && req.session.identity.nickname ? jwt.sign({
        nickname: req.session.identity.nickname,
        userid: req.session.user.user_id
      }, require('fs').readFileSync(__dirname + '/../helper/jwt.secret').toString()) : '',
      active_menu: 'live',
      noTopAd: true,
      hideMenu: true,
      isLive,
      is247: stream === null ? false : stream.is247,
      noHeaderImage: true,
      streamData
    })
  }


});

router.get('/:username/earnings', setSessionReturn, async(req, res, next) => {

  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username});
  if (user === null) {

    return next(createError(404));

  }

  const [steemAccount] = await hive.api.getAccountsAsync([user.username]);


  const [subscribed, notifications] = await subStatus(req, user);

  res.render('new/channel_earnings', {
    channel: user,
    subscribed,
    notifications,
    steem_balance: steemAccount.balance,
    sbd_balance: steemAccount.sbd_balance,
    active_menu: 'earnings',
    noTopAd: true,
    hideMenu: true
  })

});

router.get('/:username/followers', setSessionReturn, async(req, res, next) => {

  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username});
  if (user === null) {

    return next(createError(404));

  }

  hive.api.getFollowers(req.params.username, '', 'blog', 1000, function(err, result) {

    res.render('new/channel_followers', {followers: result, channel: user, last: result[result.length - 1].follower})

  })

});

router.get('/:username/about', setSessionReturn, async(req, res, next) => {

  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username})
  if (user === null) {

    return next(createError(404));

  }


  const [subscribed, notifications] = await subStatus(req, user);
//TODO: load about from DB
  res.render('new/channel_about', {
    channel: user,
    json: {},
    subscribed,
    notifications,
    active_menu: 'about',
    noTopAd: true,
    hideMenu: true
  })

});

router.get('/:username', setSessionReturn, async(req, res, next) => {

  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username});
  if (user === null) {

    return res.render('new/no_channel')

  }

  //const [subscribed, notifications] = await subStatus(req, user);

  
  let subscribed = false;
  let notifications = false;

  if (req.user) {
    let sub = await mongo.Subscription.findOne({
      channel: req.params.username,
      userId: req.user.user_id
    });

    if (sub !== null) {
      subscribed = true;
    }
  }

  const all = [];

  const videos = await mongo.Video.find({
    status: 'published',
    owner: user.username
  }).sort('-created');

  /*const podcasts = await mongo.Podcast.find({
    status: 'published',
    owner: user.username
  }).sort('-created');*/

  
  for (const x of helper.processFeed(videos)) {

    x.type = 'video';
    all.push(x)

  }

  /*for (const x of podcasts) {

    x.type = 'podcast';
    x.fileUrl = helper.bunny.generateSignature('/' + x.owner + '/' + x.permlink + '/' + x.filename, x.duration)
    const tokenThumbnail = helper.bunny.generateSignature('/' + x.owner + '/' + x.permlink + '/' + x.thumbnail, x.duration)

    x.thumbnailUrl = `${APP_AUDIO_CDN_DOMAIN}` + '/' + x.owner + '/' + x.permlink + '/' + x.thumbnail + '?token=' + tokenThumbnail.token + '&expires=' + tokenThumbnail.expires

    all.push(x)

  }*/

  all.sort((a, b) => {

    return b.created - a.created

  })

  // console.log(all)


  res.render('new/channel', {
    channel: user,
    videos: all,
    subscribed,
    notifications,
    active_menu: '',
    noTopAd: true,
    hideMenu: false
  })

});

router.get('/:username/podcast', setSessionReturn, async(req, res, next) => {
  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username});
  if (user === null) {
    return res.render('new/no_channel')
  }
  let subscribed = false;
  let notifications = false;
  if (req.user) {
    let sub = await mongo.Subscription.findOne({
      channel: req.params.username,
      userId: req.user.user_id
    });
    if (sub !== null) {
      subscribed = true;
    }
  }
  let audios = await mongo.PodcastEpisode.find({
    status: 'published',
    owner: user.username
  }).sort('-created');
  let all = [];
  for (const audio of audios) {
    audio.thumbnail = `${APP_BUNNY_IPFS_CDN}/ipfs/${audio.thumbnail.replace('ipfs://', '')}/`;
    console.log(`Audio thumb url is - ${audio.thumbnail}`);
    all.push(audio)
  }
  res.render('new/channel_podcast', {
    channel: user,
    audios: all,
    subscribed,
    notifications,
    active_menu: 'podcast',
    noTopAd: true,
    hideMenu: false
  })

});

function* createPermlink(title, author, parent_author, parent_permlink) {

  let permlink;
  if (title && title.trim() !== '') {

    let s = slug(title);
    if (s === '') {

      s = base58.encode(secureRandom.randomBuffer(4));

    }
    s = s.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    // ensure the permlink(slug) is unique
    const prefix = '';
    permlink = prefix + s;

  } else {

    permlink = Date.now().toString(36);

  }

  return permlink;

}

function slug(text) {

  let slug = text.replace(/[^A-Za-z0-9]/g, '-');
  slug = slug.replace(/--+/g, '-');
  slug = slug.replace(/-$/, '');
  slug = slug.replace(/^-/, '');
  return slug;

}


function buildProxyJson() {

  return JSON.stringify({
    app: '3SpeakComment/0.2'
  })

}

function likeExistsMongo(mongolikes, steemname) {

  for (let i = 0; i < mongolikes.length; i++) {

    if (mongolikes[i].userId === steemname) {

      return true

    }

  }

  return false

}

router.post('/api/upvote-value', upvoteValue.weightToDollars, (req, res) => {

  const {estimate} = req.data;

  res.json({sbd: estimate})

});

router.get('/api/dollars-to-weight', upvoteValue.dollarsToWeight, async(req, res) => {

  const {weight} = req.data;

  res.json({weight: weight})

});

/*router.post('/api/comment/like-count', async(req, res) => {

  const {author = undefined, permlink = undefined} = req.body;
  let username;

  if (Object.prototype.hasOwnProperty.call(req, 'user')) {

    username = req.user.nickname;

  } else {

    username = '';

  }

  const jsonResponse = {
    liked: false,
    disliked: false,
    tipped: false,
    author: author,
    permlink: permlink,
    upvotes: 0,
    tips: 0,
    downvotes: 0,
    upvoters: [],
    downvoters: [],
    tippers: []
  };

  const mongolikes = await mongo.Like.find({'author': author, 'permlink': permlink}, function(err, cursor) {

    return cursor

  });

  if (mongolikes) {

    for (let i = 0; i < mongolikes.length; i++) {

      mongolikes[i].userId = mongolikes[i].userId.replace('oauth2|Hivesigner', '')

    }

  }

  // const tips = await(await(fetch('https://tipu.online/tips/permlink/@'+author+'/'+permlink))).json()

  jsonResponse.tips = 0;
  jsonResponse.tippers = [];


  hiveClient.database.call('get_active_votes', [author, permlink]).then(result => {

    if (err) {

      return jsonResponse; //Temp fix

    }
    result = JSON.parse(JSON.stringify(result));

    //add all steem likes
    jsonResponse.upvotes += result.length;
    //add all mongo votes
    jsonResponse.upvotes += mongolikes.length;

    for (let i = 0; i < result.length; i++) {

      const vote = result[i];

      if (vote.percent <= 0) {

        jsonResponse.upvotes -= 1;
        if (vote.percent < 0) {

          jsonResponse.downvotes += 1;
          jsonResponse.downvoters.push({
            'voter': vote.voter,
            'percent': vote.percent / 100,
            rshares: parseInt(vote.rshares)
          });
          if (vote.voter === username) {

            jsonResponse.disliked = true;

          }

        }

      } else if (vote.percent > 0) {

        jsonResponse.upvoters.push({voter: vote.voter, percent: vote.percent / 100, rshares: parseInt(vote.rshares)});
        if (username === vote.voter) {

          jsonResponse.liked = true

        }

      } else if (likeExistsMongo(mongolikes, vote.voter)) {

        jsonResponse.upvotes -= 1

      }

    }

    jsonResponse.upvoters.sort(function(a, b) {

      return b.rshares - a.rshares

    });
    jsonResponse.downvoters.sort(function(a, b) {

      return a.rshares - b.rshares

    });

    return res.json(jsonResponse)

  })

});*/

router.post('/api/comment/edit', requireLogin, async(req, res) => {

  res.send(400).end()

});

router.post('/api/comment', requireLogin, async(req, res) => {

  const {author = undefined, permlink = undefined, comment = undefined} = req.body;

  if (req.user.nickname === 'guest-account') {

    return res.json({error: 'The guest account can not create comments.'})

  }

  if (author === undefined || permlink === undefined || comment === undefined) {

    return res.json({error: 'Missing fields'})

  }

  if (req.user.isSteem === true) {

    const content = await hive.api.getContentAsync(author, permlink);
    if (content.id === 0) {

      return res.json({error: 'Content not found'})

    }


    //COMMENT

    const json = buildProxyJson(); // CHECK
    const cPermlink = createPermlink('', req.user.nickname, author, permlink).next().value;

    const operations = [
      ['comment', {
        parent_author: author,
        parent_permlink: permlink,
        author: req.user.nickname,
        permlink: cPermlink,
        title: '',
        body: comment,
        json_metadata: json
      }], ['comment_options', {
        author: req.user.nickname,
        permlink: cPermlink,
        max_accepted_payout: '100000.000 SBD',
        percent_hbd: 10000,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: [[0, {
          beneficiaries: [
            {account: 'threespeakwallet', weight: 1100}
          ]
        }]]
      }]
    ];

    hive.broadcast.send({
      operations: operations
    }, {posting: THREESPEAK_POSTING_WIF}, async(err, result) => {

      if (err) {

        return res.status(500).json({
          error: 'Error broadcasting using comment proxy. Please contact the support: ' + err.message
        });

      }

      res.json({err, result})

    })


  } else {

    return res.status(400).json({
      error: 'Bad Request'
    });

  }

});

router.post('/api/reblog', requireLogin, async(req, res) => {

  const username = req.user.nickname;

  if (req.user.nickname === 'guest-account') {

    return res.json({error: 'The guest account can not create comments.'})

  }

  const json = JSON.stringify(['reblog', {
    username,
    author: req.body.author,
    permlink: req.body.permlink
  }]);

  hive.broadcast.customJson(THREESPEAK_POSTING_WIF, [], [username], 'follow', json, (err, result) => {

    res.send()

  });

});

router.post('/api/vote', requireLogin, async(req, res) => {

  let {author = undefined, permlink = undefined, weight = 1000, mongoadd = false} = req.body;

  if (req.user.nickname === 'guest-account') {

    return res.json({error: 'The guest account can not vote.'})

  }

  weight = parseInt(weight);
  if (weight < -10000 || weight > 10000) {

    return res.json({error: 'Invalid vote weight.'})

  }
  if (req.user.isSteem !== true) {

    return res.json({error: 'Only users logged in via Hivesigner can vote.'})

  }

  const operations = [
    ['vote', {
      voter: req.user.nickname,
      author,
      permlink,
      weight
    }]
  ]

  hive.broadcast.send({
    operations: operations
  }, {posting: THREESPEAK_POSTING_WIF}, async(err, result) => {

    if (err) {
      return res.status(500).json({
        error: 'Error broadcasting using comment proxy. Please contact the support: ' + err.message
      });

    }
    res.json({success: true})
  })

});

router.post('/api/creator/vote/day', requireLogin, async(req, res) => {

  let creator = req.body.creator;

  creator = await mongo.ContentCreator.findOne({'username': creator});

  if (creator === null || creator.canProxyUpvote === null || creator.upvoteDay === null) {

    res.json({
      error: 'Not able to upvote.'
    });
    return;

  }

  const upvoteDay = creator.upvoteDay;
  const date = new Date();
  const today = date.getDate()

  if (today > upvoteDay || creator.canProxyUpvote === false) {

    if (creator.queuedCanProxyUpvote) {

      if (today >= 23) {

        date.setDate(creator.queuedUpvoteDay)
        date.setHours(0, 0, 0, 0);
        date.setMonth(date.getMonth() + 1)
        return res.json({
          date: date
        })

      }
      return res.json({
        upvoteEnabled: false
      })

    }
    return res.json({
      upvoteEnabled: false
    })


  } else if (today === upvoteDay) {

    const endOfDay = new Date()
    endOfDay.setDate(upvoteDay + 1);
    endOfDay.setHours(0, 0, 0);

    let diff = Math.abs(endOfDay - date);
    diff = diff / 3.6e6;
    diff = diff.toFixed(1);

    return res.json({
      upvoteEnabled: true,
      diff
    });
    return;

  }

  date.setDate(upvoteDay);
  date.setHours(0, 0, 0, 0);

  return res.json({
    date: date
  })

});

router.post('/api/creator/vote', requireLogin, upvoteValue.dollarsToWeight, async(req, res) => {

  let {
    author = undefined,
    permlink = undefined,
    videoOwner = undefined,
    videoPermlink = undefined,
    estimate = undefined
  } = req.body;
  const user = req.user.nickname;
  const {weight} = req.data;
  estimate = Math.round(estimate);
  
  if(weight < 0) {
    weight = weight * -1
  }


  const creator = await mongo.ContentCreator.findOne({'username': user});

  const now = new Date();
  const upvoteDay = creator.upvoteDay;

  if (creator && creator.canProxyUpvote) {

    if (author !== user) {

      if (now.getDate() === upvoteDay) {

        if (user === videoOwner) {

          if ([1, 2, 3, 4].includes(Math.round(estimate))) {

            let votes = await mongo.CreatorVote.aggregate([
              {$match: {username: user}},
              {$group: {_id: '$username', total: {$sum: '$dollars'}}}
            ]);

            let daily_limit = await mongo.ContentCreator.findOne({
              username: user
            });
            daily_limit = daily_limit.limit;

            if (votes[0]) {

              votes = votes[0].total;

            } else {

              votes = 0

            }

            if (daily_limit - votes >= estimate) {

              const operations = [
                ['vote', {
                  voter: 'threespeak',
                  author,
                  permlink,
                  weight
                }]
              ]

              hive.broadcast.send({
                operations: operations
              }, {posting: THREESPEAK_POSTING_WIF}, async(err, result) => {

                if (err) {

                  res.json({error: err})

                } else {

                  const creatorVote = new mongo.CreatorVote();
                  creatorVote.username = user;
                  creatorVote.author = author;
                  creatorVote.permlink = permlink;
                  creatorVote.dollars = estimate;
                  creatorVote.save();
                  res.json({ok: 200})

                }

              });

            } else {

              res.json({error: 'You\'ve used up your upvotes for today.'})

            }

          } else {

            res.json({error: 'Incorrect upvote value.'})

          }

        } else {

          res.json({error: 'Can only perform this action when you are the video owner.'})

        }

      } else {

        res.json({error: 'You connot upvote today.'})

      }

    } else {

      res.json({error: 'You cannot upvote yourself.'})

    }

  } else {

    res.json({error: 'Must be a content creator with permission to proxy vote.'})

  }

});

router.post('/api/creator/can-proxy-vote', requireLogin, async(req, res) => {

  const user = req.user.nickname;
  const isSteem = req.user.isSteem;
  const now = new Date();
  if (isSteem) {

    const creator = await mongo.ContentCreator.findOne({'username': user});
    if (creator && creator.canProxyUpvote && creator.upvoteDay === now.getDate()) {

      res.json({proxy_vote: true})

    } else {

      res.json({proxy_vote: false})

    }

  } else {

    res.json({proxy_vote: false})

  }

})

router.post('/api/creator/remaining-proxy', requireLogin, async(req, res) => {

  const user = req.user.nickname;

  //calculate sum of all upvotes made since midnight
  const votes = await mongo.CreatorVote.aggregate([
    {$match: {created: {$gte: new Date(new Date().setHours(0, 0, 0, 0))}}},
    {$match: {username: user}},
    {$group: {_id: '$username', total: {$sum: '$dollars'}}}
  ]);

  let daily_limit = await mongo.ContentCreator.findOne({
    username: user
  });
  daily_limit = daily_limit.limit;

  if (votes[0]) {

    votes[0].total = daily_limit - votes[0].total;
    res.json(votes[0])

  } else {

    res.json({total: daily_limit})

  }

});

/*router.post('/api/community-create', async(req, res) => {
  req.body.op[1].owner.weight_threshold = parseInt(req.body.op[1].owner.weight_threshold);
  req.body.op[1].posting.weight_threshold = parseInt(req.body.op[1].posting.weight_threshold);
  req.body.op[1].active.weight_threshold = parseInt(req.body.op[1].active.weight_threshold);
  req.body.op[1].owner.key_auths[0][1] = 1;
  req.body.op[1].posting.key_auths[0][1] = 1;
  req.body.op[1].active.key_auths[0][1] = 1;
  req.body.op[1].owner.account_auths = [];
  req.body.op[1].posting.account_auths = [];
  req.body.op[1].active.account_auths = [];

  if (req.body.op[0] !== 'account_create') {
    return res.json({error: 'This function is only for account creation purposes.'})
  }

  console.log(req.body.op)
  await hiveClient.broadcast.sendOperations([req.body.op], key).then(
    function(result) {
      res.json({result})
    },
    function(error) {
      error = error.jse_shortmsg
      res.json({error})
    }
  )

})*/

router.get('/api/subscribe', requireLogin, getChannel, async(req, res) => {

  if (req.channel === null) {

    return res.json({
      success: false,
      count: 0
    });

  }

  if (req.user.nickname === 'guest-account') {

    return res.json({
      status: 'unsubscribed',
      success: true
    })

  }

  req.query.alreadySubbed = (req.query.alreadySubbed == 'true')

  const follower = req.user.user_id;
  const following = req.channel.username;

  let json = JSON.stringify([
    'follow',
    {
      follower: follower,
      following: following,
      what: [req.query.alreadySubbed == true ? null : 'blog']
    }
  ])

  await hiveClient.broadcast.json({
    id: 'follow',
    json: json,
    required_auths: [],
    required_posting_auths: [follower]
  }, key)

  if (req.query.alreadySubbed) {

    await mongo.Subscription.deleteMany({
      channel: following,
      userId: follower
    });

    return res.json({
      status: 'unsubscribed',
      success: true
    })

  }

  const sub = new mongo.Subscription();
  sub.channel = req.channel.username;
  sub.userId = req.user.user_id;
  sub.notifications = false;
  await sub.save();

  return res.json({
    status: 'subscribed',
    success: true
  })


});

router.get('/api/dbsubfill', getChannel, async(req, res) => {

  const sub = new mongo.Subscription();
  sub.channel = req.channel.username;
  sub.userId = req.user.user_id;
  sub.notifications = false;
  await sub.save();
  res.send();

});

router.get('/notifications/toggle', requireLogin, async(req, res) => {
  return res.json({code: 3});
  const id = req.user.user_id;
  const channel = req.query.creator;
  let sub_settings = await mongo.Subscription.findOne({userId: id, channel: channel});
  const notifications = await emailNotificationCheck(id, channel);
  const email_settings = await mongo.EmailNotification.findOne({userId: id});
  const creator = await mongo.ContentCreator.findOne({username: channel})
  let resp = null;

  if (email_settings === null) {

    return res.json({code: 2})

  }

  if (parseInt(req.query.unsub) === 0) {

    if (email_settings) {

      if (notifications === true) {

        const index = email_settings.channels.indexOf(creator._id);
        email_settings.channels.splice(index, 1);

        resp = 0;

      } else if (notifications === false) {

        email_settings.channels.push(creator._id);
        resp = 1;

      }

      if (sub_settings === null) {

        sub_settings = new mongo.Subscription();
        sub_settings.channel = channel;
        sub_settings.notifications = true;
        sub_settings.userId = id;
        sub_settings.followed_since = new Date();
        resp = -1
        await sub_settings.save();

      }

    } else {

      resp = 2;

    }

  } else if (email_settings) {

    const index = email_settings.channels.indexOf(creator._id);

    if (index !== -1) {

      email_settings.channels.splice(index, 1);

    }
    resp = 3;

  }

  await email_settings.save();

  res.json({code: resp});

});

router.get('/api/acknowledge', async(req, res) => {

  const id = req.query.id;
  if (id === undefined) {

    return res.json({
      url: '#'
    });

  }

  const notification = await mongo.Notification.findOne({_id: id});

  if (notification === null) {

    return res.json({
      url: '#'
    });

  }

  await mongo.Notification.updateOne({_id: id}, {acknowledged: true});

  let url = '#';

  url = '#';

  return res.json({
    url
  });

});

router.get('/api/subs', async(req, res) => {

  let creators = await mongo.ContentCreator.find({banned: false});
  creators = creators.map(x => x.username);
  hive.api.getFollowing(req.query.u, null, 'blog', 1000, (err, data) => {

    try {

      res.json({
        err, data: data.map(x => {

          return {
            name: x.following,
            isContentCreator: creators.includes(x.following)
          }

        }).filter(x => x.isContentCreator === true)
      })

    } catch (e) {

      res.json({err: e, data: []})

    }

  })

});

router.get('/api/subcount', async(req, res) => {

  const subcount = await mongo.Subscription.countDocuments({channel: req.query.u});
  res.json({
    subs: subcount
  })

});

// Endpoint for generating user achievements

router.get('/:username/achievements', async(req, res) => {
  const user = await mongo.ContentCreator.findOne({banned: false, username: req.params.username})

  if (user === null) {
    return next(createError(404));
  }

  let achievements = []

  const runAchivements = async() => {

    const dboFirstVideo = await postCounter(req.params.username)

    dboFirstVideo.forEach(one => {
      achievements.push(one)
    })

    const dboFirstSubs = await subscriberCounter(req.params.username)

    dboFirstSubs.forEach(one => {
      achievements.push(one)
    })

    const dboFirstViews = await viewsCounter(req.params.username);

    dboFirstViews.forEach(one => {
      achievements.push(one)
    })
  }

  await runAchivements()

  const [subscribed, notifications] = await subStatus(req, user);

  res.render('new/channel_achievements', {
    channel: user,
    json: {},
    subscribed,
    notifications,
    active_menu: 'achievements',
    noTopAd: true,
    hideMenu: true,
    message: 'Achievements',
    achievements,
    milestoneCategories: milestoneCategories
  })
})

module.exports = router;
