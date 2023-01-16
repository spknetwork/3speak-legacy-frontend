var express = require('express');
var router = express.Router();
var getVideo = require('./middleware/getVideo');
const {mongo, processFeed} = require('../helper');
const requireLogin = require('./middleware/requireLogin')
const md5 = require('md5');
const trendingFeedGenerator = require('./helper/getTrending');

router.post('/toggle_dark_mode', requireLogin, async(req, res) => {

  if (req.session.identity && req.session.identity.username) {
    const creator = await mongo.ContentCreator.findOne({username: req.session.identity.username});
    creator.darkMode = !creator.darkMode;
    await creator.save();
    req.session.identity = creator;
  }

  res.json({success: true})

})

function normaliseTags(tags) {

  tags = tags.split(',');

  const cleanedTags = [];

  for (const i in tags) {

    let tag = tags[i];
    tag = tag.toLowerCase();
    tag = tag.replace(/[^a-z]/gi, '')
    if (!cleanedTags.includes(tag) && tag.length > 0) {

      cleanedTags.push(tag)

    }

  }

  return cleanedTags

}

router.get('/', async(req, res) => {

  res.json({
    version: {
      frontend: require('../package.json').version,
      backend: '2.0.2'
    },
    developers: [
      'vaultec',
      'sisygoboom',
      'sagarkothari88',
      'igormuba',
    ],
    routes: [
      {
        method: 'GET',
        route: '/leaderboard',
        description: 'Returns the 3Speak Creator Leaderboard'
      },
      {
        method: 'GET',
        route: '/banned',
        description: 'The list of banned users on 3Speak'
      },
      {
        method: 'GET',
        route: '/@:username',
        parameters: [
          {
            name: 'username',
            type: 'EXISTING_3SPEAK_ACCOUNT'
          }
        ],
        description: 'Returns the list of videos from that user'
      },
      {
        method: 'GET',
        route: '/@:username/:permlink',
        parameters: [
          {
            name: 'username',
            type: 'EXISTING_3SPEAK_ACCOUNT'
          },
          {
            name: 'permlink',
            type: 'PUBLISHED_VIDEO_PERMLINK'
          }
        ],
        description: 'Returns informations about a particular video.'
      },
      {
        method: 'GET',
        route: '/statistics',
        description: 'Returns 3Speak numbers and statistics'
      },
      {
        method: 'GET',
        route: '/feeds',
        description: 'Returns a list of available feeds'
      },
      {
        method: 'GET',
        route: '/feeds/trending',
        description: 'Returns the top 100 trending videos'
      },
      {
        method: 'GET',
        route: '/feeds/new',
        description: 'Returns the latest 100 videos'
      },
      {
        method: 'GET',
        route: '/feeds/trending/more',
        parameters: [
          {
            name: 'ipfsOnly',
            type: 'boolean'
          },
          {
            name: 'skip',
            type: 'int'
          }
        ],
        description: 'Returns next batch of trending videos'
      },
      {
        method: 'GET',
        route: '/feeds/@username/more',
        parameters: [
          {
            name: 'skip',
            type: 'int'
          }
        ],
        description: 'Returns next batch of trending videos for that specific user'
      },
      {
        method: 'GET',
        route: '/feeds/@username/count',
        description: 'Returns count of the videos for a specific user'
      },
      {
        method: 'GET',
        route: '/feeds/new',
        parameters: [
          {
            name: 'ipfsOnly',
            type: 'boolean'
          },
          {
            name: 'skip',
            type: 'int'
          }
        ],
        description: 'Returns the next batch of new videos.'
      },
      {
        method: 'GET',
        route: '/feeds/@username',
        description: 'Returns the latest 100 videos by @username'
      }


    ]
  })

});

router.get('/leaderboard', async(req, res) => {

  const creator = await mongo.ContentCreator.find({
    banned: false,
    score: {$gt: 0},
    canUpload: true,
    hidden: false
  }).sort('-score');

  const filteredCreator = [];

  for (const i in creator) {

    filteredCreator.push({
      rank: parseInt(i) + 1,
      score: parseFloat(creator[i].score.toFixed(5)),
      username: creator[i].username
    })

  }

  res.json(filteredCreator)

})

router.get('/@:username/:permlink', async (req, res) => {
  const {username, permlink} = req.params;

  console.log({username, permlink})
  const video = await mongo.Video.findOne({
    owner: username,
    permlink
  })
  
  res.json(processFeed([video])[0])
})

router.get('/banned', async(req, res) => {

  res.redirect('/apiv2/blacklist')

})

async function getNextRecommended(owner, lang, category, community, matchNum) {

  const query = {status: 'published', $or: [{owner: owner}]};
  if (lang != '') {

    query.language = lang;

  }
  if (category != '') {

    query.$or.push({category: category});

  }
  if (community != '') {

    query.$or.push({hive: community})

  }

  const videos = await mongo.Video.aggregate([{$match: query}, {$sample: {size: matchNum}}]);
  return videos

}

router.get('/recommended', getVideo, async(req, res) => {

  if (req.video === null || req.video.status !== 'published') {

    return res.status(404).json([])

  }

  const recommended = await getNextRecommended(req.video.owner, req.video.language, req.video.category, req.video.hive, 64);

  const feed = [];

  for (const i in recommended) {

    const item = recommended[i];

    const video = {
      image: req.video.isNsfw ? APP_NSFW_IMAGE : APP_IMAGE_CDN_DOMAIN + '/' + item.permlink + '/poster.png',
      title: item.title,
      mediaid: item.permlink,
      owner: item.owner
    }

    if (req.query.embed) {

      video.file = APP_VIDEO_CDN_DOMAIN + '/' + item.permlink + '/default.m3u8'

    } else {

      video.link = '/watch?v=' + item.owner + '/' + item.permlink

    }

    feed.push(video)

  }

  res.json(feed)

})

router.get('/blacklist', async(req, res) => {

  const list = [];
  do {

    list.push(undefined)

  } while (list.length < 10000)

  res.json({
    message: 'This list is deprecated',
    data: list
  })

})
router.get('/verificationRequested', async(req, res) => {

  const banned = await mongo.ContentCreator.find({banned: true});
  const votebanned = await mongo.ContentCreator.find({upvoteEligible: false});

  const bannedFiltered = [];

  for (const i in banned) {

    bannedFiltered.push(banned[i].username)

  }
  for (const i in votebanned) {

    if (!bannedFiltered.includes(votebanned[i].username)) {

      bannedFiltered.push(votebanned[i].username)

    }

  }


  res.json(bannedFiltered)

})


router.get('/feeds/home', async(req, res) => {
  let query = {
    recommended: true,
    status: 'published'
  };
  if (req.query.shorts === 'true') {
    query.isReel = true;
  }
  const feeds = await mongo.Video.find(query).sort('-created').limit(64)

  const feedsFinal = formatFeeds(feeds);

  res.json(feedsFinal)

})

router.get('/feeds/trending', async(req, res) => {
  let now = new Date()
  let lastWeek = new Date((new Date()).setDate(now.getDate() - 7))
  let limit = req.query.limit ? parseInt(req.query.limit) : 100

  let query = {
    status: 'published', created: {$gt: lastWeek}
  }

  if (req.query.ipfsOnly === 'true') {
    query.ipfs = {$ne: null}
  }
  if (req.query.shorts === 'true') {
    query.isReel = true;
  }

  const feeds = await mongo.Video.find(query, null, {limit}).sort('-score');

  const feedFinal = formatFeeds(feeds);

  res.json(feedFinal)

});
router.get('/feeds/trending/more', async(req, res) => {

  let query = {
    status: 'published'
  }

  if (req.query.ipfsOnly === 'true') {
    query.ipfs = {$ne: null}
  }
  if (req.query.shorts === 'true') {
    query.isReel = true;
  }

  let recommended = await trendingFeedGenerator(['en', 'es', 'fr'], 750, query, (() => {
    let skip = req.query.skip;
    if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
      skip = parseInt(skip)
    } else {
      skip = 0
    }

    return skip
  })());

  recommended = formatFeeds(recommended)

  res.json({
    trends: helper.processFeed(recommended)
  })
});
router.get('/feeds/new', async(req, res) => {

  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  let query = {
    status: 'published'
  }

  if (req.query.shorts === 'true') {
    query.isReel = true;
  }

  if (req.query.ipfsOnly === 'true') {
    query.ipfs = {$ne: null}
  }

  const feeds = await mongo.Video.find(query, null, {limit}).sort('-created');

  const feedFinal = formatFeeds(feeds);

  res.json(feedFinal)

});
router.get('/feeds/new/more', async(req, res) => {

  let query = {
    status: 'published'
  }

  if (req.query.ipfsOnly === 'true') {
    query.ipfs = {$ne: null}
  }

  if (req.query.shorts === 'true') {
    query.isReel = true;
  }

  let feeds = await mongo.Video.find(query).sort({created: -1}).skip((() => {
    let skip = req.query.skip;
    if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
      skip = parseInt(skip)
    } else {
      skip = 0
    }
    return skip
  })()).limit(48).cache(30)

  let recommended = formatFeeds(feeds)

  res.json({
    recommended
  })
});

router.get('/feeds/@:username/more', async(req, res) => {
  let query = {
    status: 'published',
    owner: req.params.username
  }
  const skipParsing = (() => {
    let skip = req.query.skip;
    if (typeof parseInt(skip) === 'number' && !isNaN(parseInt(skip))) {
      skip = parseInt(skip)
    } else {
      skip = 0
    }
    return skip
  });
  let feeds = await mongo.Video.find(query).sort({created: -1}).skip(skipParsing()).limit(48).cache(30)
  const feedFinal = formatFeeds(feeds);
  res.json(feedFinal)
});

router.get('/feeds/@:username/count', async(req, res) => {
  let query = {
    status: 'published',
    owner: req.params.username
  }
  let count = await mongo.Video.find(query).count();
  res.json({count: count});
});

router.get('/feeds/@:username', async(req, res) => {

  const feeds = await mongo.Video.find({
    status: 'published',
    owner: req.params.username
  }, null, {limit: 100}).sort('-created');

  const feedFinal = formatFeeds(feeds);

  res.json(feedFinal)

});

router.get('/feeds/firstUploads', async(req, res) => {
  let query = {
    status: 'published',
    firstUpload: true,
    owner: {$ne: 'guest-account'}
  };
  if (req.query.shorts === 'true') {
    query.isReel = true;
  }
  const feeds = await mongo.Video.find(query, null, {limit: 24}).sort('-created').cache(300);

  const feedFinal = formatFeeds(feeds);

  res.json(feedFinal)

})

router.get('/feeds/community/:community', async(req, res) => {

  res.json({
    'trending': '/trending',
    'new': '/new'
  })

})


router.get('/feeds/community/:community/:sort', async(req, res) => {

  let sort;
  switch (req.params.sort) {

    case 'trending':
      sort = '-score';
      break;
    case 'new':
      sort = '-created'
      break;
    default:
      sort = '-created'
  }

  let limit = req.query.limit ? parseInt(req.query.limit) : 100

  let query = {
    status: 'published',
    hive: req.params.community
  }

  if (req.query.ipfsOnly === 'true') {
    query.ipfs = {$ne: null}
  }

  const feeds = await mongo.Video.find(query, null, {limit}).sort(sort).cache(300);

  const feedFinal = formatFeeds(feeds)

  res.json(feedFinal)

})

function formatFeeds(feeds) {

  const feedFinal = [];


  for (const i in feeds) {

    const v = processFeed([feeds[i]])[0]

    feedFinal.push({
      created: v.created,
      language: v.language || 'en',
      views: v.views || 0,
      author: v.owner,
      permlink: v.permlink,
      title: v.title,
      duration: v.duration,
      isNsfw: v.isNsfwContent,
      tags: normaliseTags(v.tags),
      isIpfs: !!v.ipfs,
      playUrl: v.playUrl,
      ipfs: v.ipfs ? v.ipfs : null,
      isShorts: v.isReel === true,
      images: {
        ipfs_thumbnail: v.ipfs ? `/ipfs/${v.ipfs}/thumbnail.png` : null,
        thumbnail: v.baseThumbUrl,
        //poster: APP_IMAGE_CDN_DOMAIN + '/' + v.permlink + '/poster.png',
        //post: APP_IMAGE_CDN_DOMAIN + '/' + v.permlink + '/post.png'
      }
    })

  }

  return feedFinal

}

router.get('/videoData', async(req, res) => {

  if (['TEAM_IPFS'].includes(req.query.key) === false) {

    return res.json({error: 'access denied'})

  }

  let now = new Date();
  let yesterday = new Date(new Date().setDate(now.getDate() - 1));
  now = now.getTime().toString();
  yesterday = yesterday.getTime().toString();

  let {start = yesterday, end = now, creator = undefined, community = undefined} = req.query;

  start = new Date(parseInt(start));
  end = new Date(parseInt(end));

  const query = {status: 'published', created: {$gt: start, $lt: end}};

  if (creator !== undefined) {

    query.owner = creator

  }
  if (community !== undefined) {

    query.hive = community

  }

  let videos = await mongo.Video.find(query);

  videos = videos.map(x => ({
    source_url: APP_VIDEO_CDN_DOMAIN + '/' + x.permlink + '/' + x.filename,
    author: x.owner,
    title: x.title,
    permlink: x.permlink,
    duration: x.duration,
    description: x.description,
    thumbnail: APP_IMAGE_CDN_DOMAIN + '/' + x.permlink + '/thumbnail.png',
    isNsfw: x.isNsfwContent,
    lang: x.language,
    community: x.hive,
    timestamp: x.created,
    views: v.views
  }));

  return res.json(videos)

});

router.post('/statistics', async(req, res) => {

  function getDaysInMonth(m, y) {

    return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);

  }


  const statistics = {};
  const years = [2019, 2020,2021];

  async function getStatistics(month, year) {

    const today = new Date();
    today.setUTCMonth(month - 1)
    today.setUTCFullYear(year)
    const monthStart = today.setDate(1)
    const monthEnd = today.setDate(getDaysInMonth(today.getUTCMonth(), today.getUTCFullYear()))

    const query = {
      created: {
        $lt: monthEnd,
        $gte: monthStart
      }
    };

    const encodingFailed = await mongo.Video.countDocuments(Object.assign({status: 'encoding_failed'}, query)).cache(300);
    const encodingSuccessful = await mongo.Video.countDocuments(Object.assign({status: 'published'}, query)).cache(300);

    return {
      encodingFailed,
      encodingSuccessful
    }

  }

  const today = new Date();
  for (const year of years) {

    today.setUTCFullYear(year)

    statistics[today.getUTCFullYear()] = {}

    const monthsToCheck = 12;

    for (let month = 1; month <= monthsToCheck; month++) {

      statistics[today.getUTCFullYear()][month] = await getStatistics(month, today.getUTCFullYear())

    }

  }


  res.json(statistics)

})
router.post('/statistics2', async(req, res) => {

  function getDaysInMonth(m, y) {

    return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);

  }


  const statistics = {};
  const years = [2019,2020,2021];

  async function getStatistics(month, year) {

    const today = new Date();
    today.setUTCMonth(month - 1)
    today.setUTCFullYear(year)
    const monthStart = today.setDate(1)
    const monthEnd = today.setDate(getDaysInMonth(today.getUTCMonth(), today.getUTCFullYear()))

    const query = {
      timestamp: {
        $lt: monthEnd,
        $gte: monthStart
      }
    };

    const views = await mongo.View.countDocuments(query).cache(300);

    return {
      views
    }

  }

  const today = new Date();
  for (const year of years) {

    today.setUTCFullYear(year)

    statistics[today.getUTCFullYear()] = {}

    const monthsToCheck = 12;

    for (let month = 1; month <= monthsToCheck; month++) {

      statistics[today.getUTCFullYear()][month] = await getStatistics(month, today.getUTCFullYear())

    }

  }

  res.json(statistics)

})

router.get('/statistics', (req, res) => {
  res.render('api_statistics')
});

router.get('/statistics2', (req, res) => {

  res.render('api_statistics2')

})

router.post('/render_comment.html', (req, res) => {

  try {
    const post = req.body.post;
    const hiveAuthor = post.author;
    post.author = post.json_metadata.author || post.author;
    if (typeof post.author !== 'string') {
      post.author = hiveAuthor
    }
    res.render('new/api/comment.twig', {post: req.body.post, depth: 1, user: req.user && req.user.nickname ? req.user.nickname : 'null'})
  } catch (e) {
    console.log(e)
    res.send('<div class="alert alert-danger">' + e.message + '</div>')
  }

})

module.exports = router;

