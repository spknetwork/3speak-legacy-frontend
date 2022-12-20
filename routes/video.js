var express = require('express');
var router = express.Router();
var {mongo} = require('../helper');
var getVideo = require('./middleware/getVideo');
var getPodcast = require('./middleware/getPodcast');
var requireLogin = require('./middleware/requireLogin');
var hive = require('@hiveio/hive-js');
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api','true');
hive.broadcast.updateOperations();
const fetch = require('node-fetch');

router.get('/api/likes', getVideo, async(req, res) => {

  if (req.video === null) {

    return res.status(404).end();

  }
  return res.json({
    count: await mongo.Like.countDocuments({
      author: req.video.owner,
      permlink: req.video.permlink
    })
  });

})

router.get('/api/like', requireLogin, getVideo, async(req, res) => {

  if (req.video === null) {

    return res.status(404).end();

  }

  const likeExist = (await mongo.Like.findOne({
    author: req.video.owner,
    permlink: req.video.permlink,
    userId: req.user.user_id
  })) !== null;

  if (likeExist) {

    await mongo.Like.remove({
      author: req.video.owner,
      permlink: req.video.permlink,
      userId: req.user.user_id
    });

    return res.json({
      status: 'unliked',
      success: true,
      count: await mongo.Like.countDocuments({
        author: req.video.owner,
        permlink: req.video.permlink
      })
    });

  }

  const like = new mongo.Like();
  like.author = req.video.owner;
  like.permlink = req.video.permlink;
  like.userId = req.user.user_id;
  await like.save();


  return res.json({
    status: 'liked',
    success: true,
    count: await mongo.Like.countDocuments({
      author: req.video.owner,
      permlink: req.video.permlink
    })
  });

});

router.get('/api/view', getVideo, async(req, res) => {

  if (req.video === null || !req.query.token) {

    return res.json({
      success: false
    });

  }

  const secret_key = GOOGLE_RECAPTCHA_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.query.token}`;

  const data = await (await fetch(url, {method: 'post'})).json();

  if (data.success === false || data.score < 0.65) {

    return res.json({
      success: false
    });

  }


  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.split(':')[0];

  const view = new mongo.View();
  view.author = req.video.owner;
  view.permlink = req.video.permlink;
  view.userIP = ip;
  view.timestamp = new Date();
  view.userAgent = req.headers['user-agent'] || 'none';
  await view.save();
  const video = await mongo.Video.findOne({owner: req.video.owner, permlink: req.video.permlink});
  video.views += 1;
  await video.save();
  return res.json({
    success: true
  });

});
router.get('/api/view_podcast', getPodcast, async(req, res) => {

  if (req.podcast === null || !req.query.token) {

    return res.json({
      success: false
    });

  }

  const secret_key = GOOGLE_RECAPTCHA_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.query.token}`;

  const data = await (await fetch(url, {method: 'post'})).json();

  if (data.success === false || data.score < 0.65) {

    return res.json({
      success: false
    });

  }


  const podcast = await mongo.Podcast.findOne({owner: req.podcast.owner, permlink: req.podcast.permlink});
  podcast.views += 1;
  await podcast.save();
  return res.json({
    success: true
  });

});

router.get('/api/metrics', getVideo, async(req, res) => {

  if (req.video === null) {

    return res.json({
      views: 0
    });

  }

  mongo.View.countDocuments({author: req.video.owner, permlink: req.video.permlink}, function(err, views) {

    return res.json({
      views
    })

  }).cache(60);

});


router.get('/api/chain', getVideo, async(req, res) => {

  if (req.video === null) {

    return res.json({
      payout: 0,
      votes: 0
    });

  }
  hive.api.getContentAsync(req.video.owner, req.video.permlink, function(err, video) {

    const info = {
      votes: video.net_votes,
      comments: video.children
      //payout: parseFloat(video.last_payout <= "1970-01-01T00:00:00" ? video.pending_payout_value : parseFloat(video.total_payout_value) + parseFloat(video.curator_payout_value)).toFixed(3)
    };

    return res.json(info)

  });

});

router.get('/api/info', async(req, res) => {

  if (req.query.v && req.query.v.indexOf('/') > -1) {

    const video = await mongo.Video.find({
      owner: req.query.v.split('/')[0],
      permlink: req.query.v.split('/')[1],
      status: 'published'
    }, {
      _id: 1,
      created: 1,
      duration: 1,
      owner: 1,
      permlink: 1,
      description: 1,
      tags: 1,
      title: 1,
      status: 1
    });

    return res.json(video)

  }

  return res.json([])


});

module.exports = router;
