/* eslint-disable no-console */
const { config } = require("../config/index.js");
var express = require('express');
var router = express.Router();
const requireIdentity = require('../routes/middleware/requireIdentity')
var ObjectID = require('mongodb').ObjectID;
const hive = require('@hiveio/hive-js');
const { Client: HiveClient } = require('@hiveio/dhive')
const moment = require('moment-timezone');
const { binary_to_base58 } = require('base58-js')
const randomstring = require('randomstring');

const hiveClient = new HiveClient(`${HIVE_SECURE_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`)
var URL = require('url');
var getVideo = require('./middleware/getVideo');
var getPodcast = require('./middleware/getPodcast');
var requireLogin = require('./middleware/requireLogin');
var btoa = require('btoa');
const md5 = require('md5');
const scr = require('steem-content-renderer');
const sql = require('mssql');
const fetch = require('node-fetch');
const xss = require('xss');
const trendingFeedGenerator = require('./helper/getTrending');
const helper = require('../helper');
const mongo = helper.mongo
const rss = helper.rss;
const chunkArray = require('./helper/chunkArray')
const creatorPostingKey = THREESPEAK_POSTING_WIF;
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
  hashtagUrlFn: (hashtag) => '/search?q=' + hashtag,
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

function mixBlogsVideos(blogs, videos, limit = 12) {
  let result = blogs.concat(videos);
  for (let i = 0; i < result.length; i++) {
    if (result[i].created_at) {
      result[i].created = result[i].created_at;
      result[i].isBlog = true
    } else {
      result[i].isBlog = false
    }
  }
  result.sort(function (a, b) {
    let dateA = new Date(a.created), dateB = new Date(b.created);
    return dateB - dateA;
  });
  // result = result.slice(0, limit);
  return result;
}

async function emailNotificationCheck(userID, creatorName) {
  let result = await mongo.EmailNotification.findOne({ userId: userID });
  let creatorId = await mongo.ContentCreator.findOne({ username: creatorName });
  creatorId = creatorId._id
  creatorId = ObjectID(creatorId).toString()
  if (result === null) {
    return false
  }
  for (let i = 0; i < result.channels.length; i++) {
    let subbedchannel = result.channels[i].toString()
    if (creatorId === subbedchannel) {
      return true
    }
  }
  return false
}
async function getNextRecommended([owner, permlink], lang, category, matchNum) {
  const doc = await mongo.Video.findOne({
    owner,
    permlink
  })
  let query = { status: 'published', $or: [{ owner: owner }] };
  if (lang !== '') {
    query.language = lang;
  }
  if (category !== '') {
    query.$or.push({ category: category });
  }

  if (doc) {
    if (doc.tags) {
      const realTags = doc.tags.split(',')
      const elsoutput = await mongo.Video.aggregate([{
        $match: {
          $or: [
            ...(realTags.map(tag => ({ 'tags_v2': tag })))
          ]
        }
      }, { $sample: { size: 25 } }])
      if (elsoutput.length > 5) {
        return elsoutput;
      }
    }
  }
  let videos = await mongo.Video.aggregate([{ $match: query }, { $sample: { size: matchNum } }]);
  return videos
}

function videosPerLoadPerCreatorLimiter(recommended) {
  recommended = recommended.filter((video, index, arr) => {
    return arr.map(mapObj => mapObj.owner).indexOf(video.owner) === index;
  });

  return recommended;
}


async function getLanguageSettings(req) {
  var langs = await mongo.Language.find().cache(30);
  let languages = [];
  for (let i = 0; i < langs.length; i++) {
    languages.push(langs[i].code);
  }

  if (req.user) {
    languages = await mongo.LanguageSetting.findOne({ userId: req.user.user_id }).cache(30);
    if (languages === null) {
      languages = new mongo.LanguageSetting({
        userId: req.user.user_id
      });

      await languages.save();
    }
    languages = languages.languages;
  }

  return languages
}


router.get('/_sess_dump_', async (req, res) => res.json(req.session))

router.get('/', async (req, res, next) => {
  let languages = await getLanguageSettings(req);
  const pinned = await mongo.Video.find({
    status: 'published',
    pinned: true
  }, null, { limit: 750 }).sort('-created');

  let feed;
  if (req.user) {
    let subs = await mongo.Subscription.find({ userId: req.user.user_id });
    let subchannels = [];
    for (let i = 0; i < subs.length; i++) {
      subchannels.push(subs[i].channel)
    }

    feed = pinned.concat(await mongo.Video.find({
      status: 'published',
      pinned: false,
      $or: [{ recommended: true }, { owner: { $in: subchannels } }]
    }, null, { limit: 64 }).sort('-created'))
  } else {
    feed = pinned.concat(await mongo.Video.find({
      recommended: true,
      pinned: false,
      status: 'published'
    }).sort('-created').limit(64));
  }

  feed = helper.processFeed(videosPerLoadPerCreatorLimiter(feed));

  feed = chunkArray(feed, 12);

  res.render('new/index', {
    feed: feed,
    darkMode: req.query.dark === 'on',
    sess: req.session
  });
});

router.get('/openDapp', async (req, res) => {
  let uri = req.query.uri

  res.render('new/openDapp.twig', { uri })
})

router.get('/health', (req, res) => {
  res.status(200).end()
});

router.get('/favicon.ico', (req, res) => {
  return res.redirect('/favicon.png')
})


router.get('/api/feed/more', async (req, res) => {
  let feed;
  let pinned = [];
  if (req.user) {
    let subs = await mongo.Subscription.find({ userId: req.user.user_id });
    let subchannels = [];
    for (let i = 0; i < subs.length; i++) {
      subchannels.push(subs[i].channel)
    }

    feed = pinned.concat(await mongo.Video.find({
      status: 'published',
      pinned: false,
      $or: [{ recommended: true }, { owner: { $in: subchannels } }]
    }, null, {
      limit: 64, skip: (() => {
        let skip = req.query.skip;
        if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
          skip = parseInt(skip)
        } else {
          skip = 0
        }

        return skip
      })()
    }).sort('-created'))
  } else {
    feed = pinned.concat(await mongo.Video.find({
      recommended: true,
      pinned: false,
      status: 'published'
    }).sort('-created').limit(64).skip((() => {
      let skip = req.query.skip;
      if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
        skip = parseInt(skip)
      } else {
        skip = 0
      }

      return skip
    })()));
  }

  feed = helper.processFeed(videosPerLoadPerCreatorLimiter(feed));

  res.json(feed)

})

router.get('/feed', async (req, res, next) => {
  let feed;
  if (req.user) {

    let subs = await mongo.Subscription.find({ userId: req.user.user_id });
    let subchannels = [];
    for (let i = 0; i < subs.length; i++) {
      subchannels.push(subs[i].channel)
    }

    feed = await mongo.Video.find({
      status: 'published',
      owner: { $in: subchannels }
    }, null, { limit: 100 }).sort('-created');
  } else {
    feed = await mongo.Video.find({ recommended: true, status: 'published' }).sort('-created').limit(64);
  }

  feed = chunkArray(helper.processFeed(feed), 32);

  res.render('new/feed', { title: 'Express', feed })
});

router.get('/t/:tag', async (req, res) => {
  const tagId = req.params.tag;
  console.log(tagId)
  let feed = await mongo.Video.find({
    status: 'published',
    tags_v2: {
      $in: [
        tagId
      ]
    }
  }, null, {limit: 100}).sort('-created').cache(12000);



  feed = chunkArray(helper.processFeed(feed), 32);
  //feed = helper.processFeed(elsoutput)

  res.render('new/tagFeed', { title: 'Express', feed: feed, tag: tagId })
});


router.get('/new', async (req, res, next) => {

  console.log(new Date())
  let recommended = await mongo.Video.find({ status: 'published' }).sort({ created: -1 }).limit(48).cache(30)

  console.log(recommended[0])
  recommended = helper.processFeed(videosPerLoadPerCreatorLimiter(recommended));

  let lastCreated = recommended[recommended.length - 1].created.toString();

  console.log(new Date())
  res.set('Cache-control', 'public, max-age=3000')
  res.render('new/new', { cache: true, title: 'Express', recommended, lastCreated })

});

router.get('/api/new/more', async (req, res) => {

  let recommended = await mongo.Video.find({ status: 'published' }).sort({ created: -1 }).skip((() => {
    let skip = req.query.skip;
    if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
      skip = parseInt(skip)
    } else {
      skip = 0
    }

    return skip
  })()).limit(48).cache(30)

  recommended = videosPerLoadPerCreatorLimiter(helper.processFeed(recommended));

  res.json({
    recommended
  })
});

router.get('/trends', async (req, res) => {

  let languages = await getLanguageSettings(req);

  let recommended = await trendingFeedGenerator(languages)
  recommended = helper.processFeed(recommended)
  let realTrending = chunkArray(recommended, 6);

  res.render('new/trends', { title: 'Express', recommended: realTrending });
});

router.get('/api/trends/more', async (req, res) => {

  let languages = await getLanguageSettings(req);

  let recommended = await trendingFeedGenerator(languages, 750, {}, (() => {
    let skip = req.query.skip;
    if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
      skip = parseInt(skip)
    } else {
      skip = 0
    }

    return skip
  })());

  recommended = helper.processFeed(videosPerLoadPerCreatorLimiter(recommended));

  recommended = chunkArray(recommended, 6);

  res.json({
    trends: recommended[0]
  })
});

router.get('/livestreams', async (req, res) => {
  function getStreams(is247 = false) {
    return new Promise((resolve, reject) => {
      let url = `https://${APP_LIVE_DOMAIN}/list`;
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

  async function getProStreams() {

    try {
      const data = await (await fetch('https://live-pro.3speak.co/live')).json()
      return data;
    } catch (e) {
      return [];
    }

  }

  let streams = [];
  let streams247 = [];
  let streamsPro = [];

  let data = await getStreams();
  let proData = await getProStreams();

  for (let i in data) {
    if (!proData.map(x => x.name).includes(data[i].substr(data[i].indexOf('_') + 1))) {
      let stream = await mongo.Livestream.findOne({ channel: data[i].substr(data[i].indexOf('_') + 1) })
      if (stream !== null) {
        streams.push(stream)
      }
    }
  }

  for (let i of proData) {

    let stream = await mongo.Livestream.findOne({ channel: i.name })
    if (stream !== null) {
      streamsPro.push(stream)
    }
  }

  console.log(proData)

  res.render('new/livestreams', { streams, streams247, streamsPro })
});

router.get('/newcomers', async (req, res) => {
  let newbies = await mongo.Video.find({
    status: 'published',
    firstUpload: true,
    owner: { $ne: 'guest-account' }
  }, null, { limit: 24 }).sort('-created').cache(300);

  let actualNewbies = helper.processFeed(newbies)

  res.render('new/newcomers', { title: 'Express', newbies: actualNewbies });
});


router.get('/api/search/more', async (req, res) => {



  let { q = undefined, scroll_id } = req.query;
  if (q !== undefined) {
    let results = await (await fetch('https://api.hivesearcher.com/search', {
      method: 'POST',
      body: JSON.stringify({ q, sort: 'newest', scroll_id }),
      headers: {
        'Authorization': config.hiveSearcherAuth,
        'content-type': 'application/json'
      }
    })).json()

    console.log(results.scroll_id, results.results.length)
    let out = []
    for (let i = 0; i < results.results.length; i++) {
      results.results[i].owner = results.results[i].author;
      results.results[i].created = results.results[i].created_at;
      delete results.results[i].author;
      delete results.results[i].created_at;
      //const baseUrl = binary_to_base58(Buffer.from(`${APP_IMAGE_CDN_DOMAIN}/${results.results[i].permlink}/thumbnails/default.png`));
      //results.results[i].thumbUrl = `https://images.hive.blog/p/${baseUrl}?format=jpeg&mode=fit&width=340&height=191`;

      let res = await mongo.Video.findOne({
        status: 'published',
        owner: results.results[i].owner,
        permlink: results.results[i].permlink
      }).cache(30)
      if(res) {
        out.push(results.results[i])
      }
    }
    res.json({
      scroll_id: results.scroll_id,
      results: helper.processFeed(out)
    })


  } else {
    return res.json('broke')
  }

})
router.get('/search', async (req, res) => {
  let { q = undefined } = req.query;
  const searchQuery = q + ' Watch on 3speak type:post';
  if (q !== undefined) {
    let results = await (await fetch('https://api.hivesearcher.com/search', {
      method: 'POST',
      body: JSON.stringify({ q: searchQuery, sort: 'newest' }),
      headers: {
        'Authorization': config.hiveSearcherAuth,
        'content-type': 'application/json'
      }
    })).json()

    console.log(results.scroll_id)
    let out = []
    for (let i = 0; i < results.results.length; i++) {
      results.results[i].owner = results.results[i].author;
      results.results[i].created = results.results[i].created_at;
      delete results.results[i].author;
      delete results.results[i].created_at;
      const baseUrl = binary_to_base58(Buffer.from(`${APP_IMAGE_CDN_DOMAIN}/${results.results[i].permlink}/thumbnails/default.png`));
      results.results[i].thumbUrl = `https://images.hive.blog/p/${baseUrl}?format=jpeg&mode=cover&width=340&height=191`;
      if(results.results[i].app.includes('3speak')) {
        out.push(results.results[i])
      }
    }

    console.log(results.results[0])

    return res.render('new/search', {
      results,
      searchQuery
    })
  }

  return res.redirect('/')
});

router.get('/subscriptions', requireLogin, async (req, res) => {
  let subs = await mongo.Subscription.find({ userId: req.user.user_id });

  subs = subs.map(x => x.channel);

  let videos = await mongo.Video.find({ owner: { $in: subs }, status: 'published' }).sort('-created').cache(60);

  res.render('new/subscriptions', { videos })
});

function getVersion() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return 'v' + day.toString()
}

router.get('/read', async (req, res) => {
  const { author, permlink, root_author, root_permlink } = req.query;
  const content = await hive.api.getContentAsync(author, permlink);

  let bodyText = '';
  if (content.body.length > 0) {
    bodyText = renderer.render(content.body).replace(/<iframe.+?<\/iframe>/g, '')
  }

  const data = {
    root: {
      author: root_author,
      permlink: root_permlink
    },
    comment: {
      author: content.author,
      permlink: content.permlink,
      hash: md5('oauth2|Hivesigner' + content.author),
      body: bodyText,
      created: moment(content.created).fromNow(),
      isOwner: content.author === root_author,
      parentPermlink: content.parent_permlink.length > 0 ? content.parent_permlink : content.permlink,
      parent: content.parent_author.length > 0 ? content.parent_author : content.author,
      depth: content.depth,
      hasReplies: content.children > 0,
      root_author: root_author,
      root_permlink: root_permlink,
      img_version: getVersion(),
      payout: String(Number(content.total_payout_value.replace(' HBD', '')).toFixed(2)),
      enableComments: req.user && req.user.user_id.indexOf('Hivesigner') > -1
    },
    parent: {
      author: content.depth > 3 ? content.parent_author : root_author,
      permlink: content.depth > 3 ? content.parent_permlink : root_permlink
    }
  };
  res.render('new/read', data)
});

router.get('/watch', getVideo, async (req, res, next) => {

  const demoAd = req.query.demoad === 'ok' ? true : undefined;

  if (req.video === null || req.video.status !== 'published') {
    let e = new Error('Video not found.');
    e.link = '/';
    e.status = 404;
    return next(e)
  }
  let liked = false;
  let subscribed = false;
  let notifications = false;

  if (req.user) {

    let like = await mongo.Like.findOne({
      author: req.video.owner,
      permlink: req.video.permlink,
      userId: req.user.user_id
    });

    if (like !== null) {
      liked = true;
    }
    let sub = await mongo.Subscription.findOne({
      channel: req.video.owner,
      userId: req.user.user_id
    });

    if (sub !== null) {
      subscribed = true;
    }
  }

  let otherVideos = await mongo.Video.aggregate([
    {
      $match: {
        status: 'published',
        owner: req.video.owner,
        permlink: { $ne: req.video.permlink }
      }
    },
    {
      $sample: {
        size: 5
      }
    }
  ]);

  let otherVideosByOthers = (await getNextRecommended([req.video.owner, req.video.permlink], req.video.language, req.video.category, 18));

  let autoplayNext = otherVideosByOthers[0];

  req.video.description = renderer.render(req.video.description);
  req.video.titleb64 = btoa(req.video.title);
  let index = !isNaN(parseInt(req.query.i)) ? parseInt(req.query.i) : 1;
  let host = APP_PAGE_PROTOCOL + '://' + APP_PAGE_DOMAIN

  let playback = {
    type: 'm3u8'
  };
  let post = null;
  try {
    post = await hiveClient.database.call('get_content', [req.video.owner, req.video.permlink])
    post.popoverId = 'root'
    post.payout = parseFloat(post.total_payout_value) + parseFloat(post.pending_payout_value)
  } catch (e) {
    post = {
      active_votes: [],
      popoverId: 'root',
      payout: '0.000'
    }
  }

  let donations = []
  if (req.video.donations === true) {
    donations = await mongo.Donation.find({ username: req.video.owner })
  }

  let actualDonations = [];
  for (let donation of donations) {
    if (donation.address.includes(' ')) {
      continue;
    }
    if (donation.address.endsWith('.wam') || donation.address.endsWith('.waa')) {
      actualDonations.push(donation);
      continue;
    }
    if (donation.address.match(new RegExp('^0x[a-fA-F0-9]{40}'))) {
      actualDonations.push(donation);
      continue;

    }
    if (donation.address.match(new RegExp('^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'))) {
      actualDonations.push(donation);
      continue;

    }
    if (donation.address.match(new RegExp('^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,59}$'))) {
      actualDonations.push(donation);
      continue;
    }
  }

  let playUrl;
  if(req.video.upload_type === "ipfs") {
    playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${req.video.video_v2.replace('ipfs://', '')}`
    req.video.isPodcastEpisode = false;
  } else if (req.video.enclosureUrl !== undefined && req.video.enclosureUrl !== null && req.video.enclosureUrl.length > 0) {
    playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${req.video.enclosureUrl.replace('ipfs://', '')}`
    playback.file = playUrl;
    req.video.baseThumbUrl = req.video.thumbnail;
    req.video.isPodcastEpisode = true;
  } else {
    playUrl = `${APP_VIDEO_CDN_DOMAIN}/${req.video.permlink}/default.m3u8`
    req.video.isPodcastEpisode = false;
  }

  req.video.playUrl = playUrl;

  video = helper.processFeed([req.video])[0]

  // if(video.podcast_transfered) {
  //   video.downloadUrl = `https://s3.us-west-1.wasabisys.com/podcast-data/${ video.permlink }/main.mp4`
  // } else {
  //   if(video.filename.startsWith('ipfs://')) {
  //     video.downloadUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.filename.replace('ipfs://', '')}`
  //   } else {
  //     video.downloadUrl = `${APP_VIDEO_CDN_DOMAIN}/${video.filename}`
  //   }
  // }

  video.playUrl = playUrl;
  res.render('new/watch', {
    video: video,
    liked,
    subscribed,
    notifications,
    owner: await mongo.ContentCreator.findOne({ username: req.video.owner }),
    otherVideos: helper.processFeed(otherVideos),
    otherVideosByOthers: helper.processFeed(otherVideosByOthers),
    hideMenu: true,
    noAds: true,
    noTopAd: true,
    demoAd,
    playback,
    m3u8: playback.file,
    autoplayNext,
    post,
    donations: actualDonations,
    isPodcastEpisode: req.video.isPodcastEpisode,
  })
});

router.get('/podcast', getPodcast, async (req, res, next) => {

  if (req.podcast === null || req.podcast.status !== 'published') {
    let e = new Error('Podcast not found.');
    e.link = '/';
    e.status = 404;
    return next(e)
  }
  let liked = false;
  let subscribed = false;
  let notifications = false;

  let otherPodcasts = await mongo.Podcast.aggregate([
    {
      $match: {
        status: 'published',
        owner: req.podcast.owner,
        permlink: { $ne: req.podcast.permlink }
      }
    },
    {
      $sample: {
        size: 5
      }
    }
  ]);

  req.podcast.description = renderer.render(req.podcast.description);
  req.podcast.titleb64 = btoa(req.podcast.title);

  const token = helper.bunny.generateSignature('/' + req.podcast.owner + '/' + req.podcast.permlink + '/' + req.podcast.filename, req.podcast.duration)
  const tokenThumbnail = helper.bunny.generateSignature('/' + req.podcast.owner + '/' + req.podcast.permlink + '/' + req.podcast.thumbnail, req.podcast.duration)

  res.render('new/podcast', {
    podcast: req.podcast,
    liked,
    subscribed,
    notifications,
    owner: await mongo.ContentCreator.findOne({ username: req.podcast.owner }),
    otherPodcasts,
    hideMenu: true,
    noTopAd: true,
    playbackUrl: APP_AUDIO_CDN_DOMAIN + '/' + req.podcast.owner + '/' + req.podcast.permlink + '/' + req.podcast.filename + '?token=' + token.token + '&expires=' + token.expires,
    thumbnailUrl: APP_AUDIO_CDN_DOMAIN + '/' + req.podcast.owner + '/' + req.podcast.permlink + '/' + req.podcast.thumbnail + '?token=' + tokenThumbnail.token + '&expires=' + tokenThumbnail.expires
  })
});

router.get('/category', async (req, res) => {
  let languages = await getLanguageSettings(req);

  let today = new Date();
  let lastWeekStart = today.setDate(today.getDate() - 7);

  let catDisplay = await mongo.ContentCategory.findOne({ code: req.query.c });
  try {
    catDisplay = catDisplay.display;
    let trends = await mongo.Video.find({
      status: 'published',
      created: { $gt: lastWeekStart },
      language: { $in: languages },
      category: req.query.c
    }, null, { limit: 12 }).sort('-score');

    let recommended = await mongo.Video.find({
      status: 'published',
      language: { $in: languages },
      category: req.query.c
    }, null, { limit: 24 }).sort('-created');
    let recommendedBlogs = await mongo.Blog.find({
      status: 'published',
      category: req.query.c
    }, null, { limit: 24 }).sort('-created_at');
    let latest = mixBlogsVideos(recommended, recommendedBlogs, 24);
    res.render('new/category', { title: 'Express', trends, latest, catDisplay });
  } catch (e) {
    res.render('new/error/404')
  }
});

router.post('/category/request', async (req, res) => {

  let catReq = new mongo.CategoryRequest();

  //catReq.username = req.user.user_id ? req.user.user_id : null
  if (Object.prototype.hasOwnProperty.call(req, 'user')) {
    catReq.username = req.user.user_id;
  }
  catReq.categoryReq = req.body.catSuggestion;

  await catReq.save();

  res.redirect('/');
});

async function removePost(community, user, permlink, prefix, admin) {
  let tx = [
    'custom_json',
    {
      'id': 'community',
      'required_posting_auths': [admin],
      'json': JSON.stringify([
        prefix + 'Post',
        {
          'community': community,
          'account': user,
          'permlink': permlink,
          'notes': 'Removed via the 3speak interface'
        }
      ])
    }
  ];

  try {
    return hive.broadcast.sendAsync({ operations: [tx] }, { posting: creatorPostingKey })
  } catch (e) {
    return e
  }
}

async function getCommunity(communityId) {

  let reqBody = {
    'id': 1,
    'jsonrpc': '2.0',
    'method': 'bridge.get_community',
    'params': { name: communityId, observer: '' }
  };

  let community = await (await fetch(`${HIVE_SECURE_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`, {
    method: 'post',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' }
  })).json();

  return community.result ? community.result : { team: [] }
}

function getTeam(community) {
  let team = [];
  let steemTeam = JSON.parse(JSON.stringify(community.team));
  for (let i = 0; i < steemTeam.length; i++) {
    team.push(steemTeam[i][0])
  }
  return team
}

router.post('/api/communities/mute-video', async (req, res) => {
  if (req.user) {
    let community = await getCommunity(req.body.comId);
    let team = getTeam(community);
    if (team.includes(req.user.nickname)) {
      await removePost(community.name, req.body.user, req.body.permlink, req.body.prefix, req.user.nickname);
      let mutethreadName = 'muted-' + community.name;
      if (req.body.prefix === 'mute') {
        await mongo.Video.updateOne(
          { owner: req.body.user, permlink: req.body.permlink },
          { $set: { hive: mutethreadName } },
          function (err, res) {
          });
      } else {
        await mongo.Video.updateOne(
          { owner: req.body.user, permlink: req.body.permlink },
          { hive: community.name }
        );
      }
      res.json({ ok: 200 })
    } else {
      res.json({ error: 'Must be an admin.' })
    }
  } else {
    res.json({ error: 'Must be logged in with admin privileges.' })
  }
});

router.get('/communities', async (req, res) => {

  let dbCommunities = await mongo.HiveCommunity.distinct('name', { used: true });

  res.render('new/communities', { community_threespeak: dbCommunities })
});

router.get('/c/:communityId', async (req, res) => {
  let communityId = req.params.communityId;

  let community = await getCommunity(communityId);
  let polls = await mongo.Poll.find({ communityId }).sort('-expires');
  let now = new Date();
  let lastWeek = new Date(new Date().setDate(now.getDate() - 7))
  console.log(now, lastWeek)
  polls.forEach((e, i) => {
    if (now > e.expires) {
      e.archived = true;
    } else {
      e.archived = false;
    }
  });
  //community.isFollowing = false;

  let team = getTeam(community);

  let isAdmin;
  if (!req.user) {
    isAdmin = false
  } else {
    isAdmin = team.includes(req.user.nickname);
  }


  let newVideos = [];
  let trendingVideos = [];
  let mutedVideos = await mongo.Video.find({ hive: 'muted-' + communityId });

  let totalViews = 0;


  community.poweredByThreespeak = true;
  newVideos = await mongo.Video.find({ status: 'published', hive: communityId }).sort('-created');
  trendingVideos = await mongo.Video.find({
    status: 'published',
    hive: communityId,
    created: { $gt: lastWeek }
  }).sort('-score');

  for (let i = 0; i < newVideos.length; i++) {
    totalViews += newVideos[i].views;
  }

  for (let i = 0; i < newVideos.length; i++) {
    newVideos[i].isTeam = team.includes(newVideos[i].owner)
  }
  for (let i = 0; i < trendingVideos.length; i++) {
    trendingVideos[i].isTeam = team.includes(trendingVideos[i].owner)
  }


  res.render('new/community', {
    newVideos: helper.processFeed(newVideos),
    trendingVideos: helper.processFeed(trendingVideos),
    community,
    team,
    isAdmin,
    mutedVideos,
    totalViews,
    polls
  })
});

router.get('/c/:communityId/poll/:pollId', async (req, res, next) => {
  let pollId = req.params.pollId.toLocaleLowerCase();
  let communityId = req.params.communityId;
  let poll = await mongo.Poll.findOne({ communityId, pollId });
  if (poll === null) {
    let e = new Error('Not Found');
    e.status = 404;
    return next(e);
  }
  let alreadyVoted = false;
  let now = new Date();
  if (now > poll.expires) {
    alreadyVoted = true
  }
  let pollData = await mongo.PollVote.find({ pollId });

  let voteMatrix = {};
  let total = 0;

  pollData.forEach((e, i) => {
    if (req.user && e.voter === req.user.nickname) {
      alreadyVoted = true;
    }
    if (voteMatrix[e.answer]) {
      voteMatrix[e.answer]++;
    } else {
      voteMatrix[e.answer] = 1;
    }
    total++;
  });

  if (!req.user) {
    alreadyVoted = true;
  }

  let votes = Object.keys(voteMatrix).map(x => ([x.replace(/'/gi, '`'), voteMatrix[x] * 100 / total]));

  res.render('new/community_polls', { poll, votes, alreadyVoted })
});

router.post('/api/poll/vote', async (req, res) => {
  let pollId = req.body.pollId;
  let choice = xss(req.body.choice);
  let existing = await mongo.PollVote.findOne({ pollId, voter: req.user.nickname });
  if (existing === null) {
    let poll = await mongo.Poll.findOne({ pollId });
    if (poll.answers.includes(choice)) {
      if (poll.expires > new Date()) {
        let doc = new mongo.PollVote();
        doc.pollId = pollId;
        doc.voter = req.user.nickname;
        doc.answer = choice;
        await doc.save();
        res.send();
      } else {
        res.json({ error: 'poll has closed' })
      }
    } else {
      res.json({ error: 'invalid answer' })
    }
  } else {
    res.json({ error: 'already voted' })
  }
});

router.post('/api/poll/create', async (req, res) => {
  let question = xss(req.body.question);
  let communityId = req.body.communityId;
  let pollId = question.slice();
  let description = xss(req.body.description);
  let answers = req.body.answers;
  let expiresData = req.body.expires;
  let owner = req.user.nickname;

  for (let i = 0; i < answers.length; i++) {
    answers[i] = xss(answers[i])
  }

  let expires = new Date();
  expires.setDate(expires.getDate() + parseInt(expiresData.days));
  expires.setHours(expires.getHours() + parseInt(expiresData.hours));
  expires.setMinutes(expires.getMinutes() + parseInt(expiresData.minutes));
  pollId = pollId.toLocaleLowerCase();
  pollId = pollId.replace(/\?/gi, '');
  pollId = pollId.replace(/[^a-zA-Z]/g, '_');
  pollId = encodeURI(pollId);

  let conflict = await mongo.Poll.findOne({ pollId, communityId });
  let salt = '';
  while (conflict !== null) {
    salt = '-' + Math.random().toString(36).substr(2, 5);
    conflict = await mongo.Poll.findOne({ pollId: pollId + salt, communityId });
  }
  pollId += salt;

  let newPoll = new mongo.Poll();
  newPoll.pollId = pollId;
  newPoll.question = question;
  newPoll.communityId = communityId;
  newPoll.answers = answers;
  newPoll.description = description;
  newPoll.expires = expires;
  newPoll.owner = owner;
  await newPoll.save();

  res.json({ pollId })
});

async function subscribe(community, user, sub) {
  let tx = ['custom_json', {
    required_auths: [],
    required_posting_auths: [user],
    id: 'community',
    json: sub === true ? JSON.stringify(['subscribe', { community: community }]) : JSON.stringify(['unsubscribe', { community: community }])
  }];
  try {

    return hive.broadcast.sendAsync({ operations: [tx] }, { posting: THREESPEAK_POSTING_WIF })

  } catch (e) {
    return e
  }
}

router.post('/api/communities/follow', async (req, res) => {
  let code = req.body.code;
  let community = await mongo.Community.findOne({ code: code });

  let membership = await mongo.CommunityMember.findOne({
    communityName: community.name,
    username: { $in: [req.user.nickname, req.user.user_id] }
  });

  if (membership === null || membership.length === 0) {
    if (req.user) {
      let membership = new mongo.CommunityMember();
      membership.communityName = community.name;
      membership.username = req.user.user_id;
      membership.isCreator = false;
      membership.isAdmin = false;
      membership.isOwner = false;
      await membership.save();
      if (req.user.isSteem) {
        await subscribe(JSON.parse(JSON.stringify(community)).hive, req.user.nickname, true);
      }
      res.json({ ok: 'followed' })
    } else {
      res.json({ error: 'You are not logged in.' })
    }
  } else {
    // unfollow
    if (membership.isAdmin || membership.isOwner) {
      res.json({ error: 'You cannot leave because you are an admin or the owner of this community.' })
    } else {
      mongo.CommunityMember.deleteOne(
        { username: { $in: [req.user.nickname, req.user.user_id] }, communityName: community.name },
        function (err, resp) {
          res.json({ ok: 'deleted' })
        })
      if (req.user.isSteem) {
        await subscribe(JSON.parse(JSON.stringify(community)).hive, req.user.nickname, false);
      }
    }
  }
});

router.all('/creator', (req, res) => {
  return res.status(301).redirect('/leaderboard')
});

router.get('/embed/suggestions', async (req, res) => {
  let query = { status: 'published', $or: [{ owner: req.query.owner }] };
  if (req.query.lang !== '') {
    query.language = req.query.lang;
  }
  if (req.query.category !== '') {
    query.$or.push({ category: req.query.category });
  }

  let videos = await mongo.Video.aggregate([{ $match: query }, { $sample: { size: 9 } }]);
  videos = chunkArray(videos, 3);
  res.render('embed/suggestions', { videos })
});

router.get('/embed/live/:channel', async (req, res) => {
  let { channel = undefined } = req.params;

  function getStreams() {
    return new Promise((resolve, reject) => {
      fetch(`${APP_PAGE_PROTOCOL}://${APP_LIVE_DOMAIN}/list`)
        .then(res => res.json())
        .then(body => {
          resolve(body)
        })
        .catch(() => {
          resolve([])
        })
    });
  }

  let streams = await getStreams();
  streams = streams.map(x => x.substr(x.indexOf('_') + 1))
  let isLive = false
  if (streams.includes(channel)) {
    isLive = true
  }

  res.render('embed/live', {
    channel,
    isLive
  })
})
router.get('/embed', async (req, res, next) => {

  if (require('fs').existsSync(__dirname + '/../.embed')) {
    return res.render('embed/disabled')
  }

  if (req.query.v && req.query.v.indexOf('/') > -1) {
    let video = await mongo.Video.findOne({
      owner: req.query.v.split('/')[0],
      permlink: req.query.v.split('/')[1]
      // status: "published"
    }, {
      _id: 1,
      created: 1,
      duration: 1,
      owner: 1,
      permlink: 1,
      description: 1,
      tags: 1,
      title: 1,
      status: 1,
      language: 1,
      category: 1,
      ipfs: 1,
      thumbnail: 1,
      video_v2: 1,
      upload_type: 1
    });
    if (!video) {
      try {
        const [author, permlink] = req.query.v.split('/')
        const post = await hiveClient.database.call('get_content', [author, permlink])
        const json_metadata = JSON.parse(post.json_metadata)
        let ipfsUrl = json_metadata.sourceMap.find(e => e.type === 'video').url;
        let imageInfo = json_metadata.sourceMap.find(e => e.type === 'thumbnail').url;
        ipfsUrl = new (require('url')).URL(ipfsUrl)
        imageInfo = new (require('url')).URL(imageInfo)
        req.video = {
          owner: author,
          permlink,
          title: json_metadata.title,
          description: json_metadata.description,
          created: json_metadata.created,
          tags: json_metadata.tags,
          status: 'published',
          playUrl: `https://ipfs.3speak.tv/ipfs/${ipfsUrl.host}${ipfsUrl.pathname}`,
          imageUrl: helper.processFeed(video)[0].thumbUrl
        }
      } catch (ex) {
        console.log(ex)
      }
    } else {
      req.video = video;
      if(req.video.ipfs) {
        req.video.playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.ipfs}/default.m3u8`
        req.video.imageUrl = `${APP_IMAGE_CDN_DOMAIN}/${video.permlink}/poster.png`
      } else if(req.video.upload_type === "ipfs") {
        req.video.playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.video_v2.replace('ipfs://', '')}`
        req.video.imageUrl = helper.processFeed([video])[0].thumbUrl
      } else {
        req.video.playUrl = `${APP_VIDEO_CDN_DOMAIN}/${video.permlink}/default.m3u8`
        req.video.imageUrl = `${APP_IMAGE_CDN_DOMAIN}/${video.permlink}/poster.png`
      }
    }
  } else {
    req.video = null;
  }

  next();

}, async (req, res) => {
  const referer = req.headers.referrer || req.headers.referer
  const host = req.headers.host
  const origin = req.headers.origin

  if (referer && referer.length > 0 && referer.indexOf('steemit.com') > -1) {

    req.video.status = 'steemit'

  }

  if (referer && referer.length > 0 && referer.indexOf('steempeak.com') > -1) {

    req.video.status = 'steemit'

  }


  let { v = undefined, category = undefined, language = undefined, autoplay = false } = req.query;

  if (v === undefined || v.indexOf('/') === -1 || req.video === null) {
    v = {
      author: 'wehmoen',
      permlink: 'ykgjpifr',
      status: 'published'
    }
  } else {
    v = v.split('/');
    if (v.length !== 2) {
      v = {
        author: 'vaultec',
        permlink: 'ykgjpifr',
        status: 'published'
      }
    } else {
      v = {
        author: xss(v[0], { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: true }),
        permlink: xss(v[1], { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: true }),
        status: req.video.status,
        title: req.video.title,
        playUrl: xss(req.video.playUrl, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: true }),
        imageUrl: xss(helper.processFeed([req.video])[0].thumbUrl, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: true })
      }
    }
  }

  let author = await mongo.ContentCreator.findOne({ username: v.author });
  let banned = author.banned;

  if (autoplay !== false) {
    autoplay = autoplay === 'true';
  }

  res.render('embed/index', {
    v, banned, autoplay, category, language, serverHost: referer && referer.length > 0 ? '"' + referer + '"' : 'undefined'
  })
});

router.get('/rss/:channel.xml', async (req, res) => {

  res.setHeader('content-type', 'application/xml')

  const videos = await mongo.Video.find({
    status: 'published',
    owner: req.params.channel
  }).sort('-created').limit(15);
  let banned = false;
  if (videos.length > 0) {
    let author = await mongo.ContentCreator.findOne({ username: req.params.channel });
    banned = author.banned;
  }
  if (banned == true) {
    // following line throws error
    // const feed = await rss(req.params.channel, []);
    // res.send(feed);
    // Let's send empty response for banned users
    res.send([]);
  } else {
    const feed = await rss(req.params.channel, videos);
    res.send(feed);
  } 
})

router.get('/api/vid_count', async (req, res) => {
  const numberVideos = await mongo.Video.countDocuments({
    status: 'published'
  })

  res.send({
    count: numberVideos
  })
})

router.get('/api/vid_count_day', async (req, res) => {
  const numberVideos = await mongo.Video.countDocuments({
    status: 'published',
    created: {
      $gte: new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000)))
    }
  })

  res.send({
    count: numberVideos
  })
})

router.get('/api/playlists/:id/feed', async (req, res) => {

  const id = req.params.id;
  const playlist = await mongo.Playlist.findOne({
    permlink: id
  })
  console.log(playlist)

  let videos = []
  let promises = []
  for (let item of playlist.list) {
    promises.push(mongo.Video.findOne({
      owner: item.owner,
      permlink: item.permlink
    }).cache(600))
  }

  res.send({
    videos: await Promise.all(promises)
  })
})

router.post('/api/playlists/create', requireLogin, async (req, res) => {

  //console.log(req.session.user.user_id)
  const body = req.body;


  const playlist = new mongo.Playlist();
  //console.log(playlist)
  playlist.title = body.title
  playlist.permlink = randomstring.generate({
    length: 10,
    readable: true,
    charset: 'alphanumeric',
    capitalization: 'lowercase'
  })
  playlist.tags = []
  playlist.list = []
  playlist.owner = req.session.identity.user_id
  await playlist.save()
  res.send({
    permlink: playlist.permlink,
    title: playlist.title
    //count: numberVideos
  })
})

router.post('/api/playlists/add', async (req, res) => {
  const { id, owner, permlink } = req.body
  console.log(req)
  const playlist = await mongo.Playlist.findOne({
    permlink: id
  })

  let alreadyExists = false
  for (let vidItem of playlist.list) {
    if (vidItem.permlink === permlink && vidItem.owner === owner) {
      alreadyExists = true
    }
  }
  if (alreadyExists) {
    return res.send({
      message: 'already exists!'
    })
  }

  await mongo.Playlist.findOneAndUpdate({
    permlink: id
  }, {
    $push: {
      list: {
        owner,
        permlink
      }
    }
  })
  res.send({
    //count: numberVideos
  })
})

router.post('/api/playlists/rm', async (req, res) => {
  const { id, owner, permlink } = req.body

  const playlist = await mongo.Playlist.findOne({
    permlink: id
  })

  let objInfo = {}
  for (let vidItem of playlist.list) {
    if (vidItem.permlink === permlink && vidItem.owner === owner) {
      objInfo = vidItem
    }
  }

  await mongo.Playlist.findOneAndUpdate({
    permlink: id
  }, {
    $pull: {
      list: {
        $in: [objInfo]
      }
    }
  })

  res.send({
    //count: numberVideos
  })
})

router.get('/api/playlists/ls', requireLogin, async (req, res) => {
  const out = await mongo.Playlist.find({
    owner: req.session.identity.user_id
  })


  return res.send({
    out
  })
})

router.get('/api/playlists/:id/thumbnail', async (req, res) => {

  const id = req.params.id;
  const playlist = await mongo.Playlist.findOne({
    permlink: id
  })
  console.log(playlist)




  let itemTile = playlist.list[playlist.list.length - 1]

  if (!itemTile) {
    return res.redirect(301, `https://${APP_STUDIO_DOMAIN}/img/default-thumbnail.jpg`)

  }

  const data = await mongo.Video.findOne({
    owner: itemTile.owner,
    permlink: itemTile.permlink
  }).cache(600)

  if (!data?.permlink) {
    return res.redirect(301, `https://${APP_STUDIO_DOMAIN}/img/default-thumbnail.jpg`)
  }
  return res.redirect(301, `${APP_IMAGE_CDN_DOMAIN}/${data.permlink}/thumbnails/default.png`);
})

router.get('/playlists', requireLogin, async (req, res) => {
  const out = await mongo.Playlist.find({
    owner: req.session.identity.user_id
  })



  return res.render('new/playlists', {
    playlists: out
  });
});


router.post('/api/playlists/delete', requireLogin, async(req, res) => {

  //console.log(req.session.user.user_id)
  const body = req.body;

  const getPlaylist = await mongo.Playlist.findOne({permlink: body.permlink})

  if(getPlaylist.owner === req.session.identity.user_id) {
    await mongo.Playlist.deleteOne({permlink: body.permlink})

    return res.send({
      status: "ok"
    })
  }

  if(getPlaylist.owner !== req.session.identity.user_id) {

    return res.status(401).send({
      status: "false"
    })
  }
})

module.exports = router;
