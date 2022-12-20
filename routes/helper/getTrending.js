const {mongo} = require('../../helper');

async function getLanguageSettings() {

  var langs = await mongo.Language.find();
  const languages = [];
  for (let i = 0; i < langs.length; i++) {

    languages.push(langs[i].code);

  }

  return languages

}

const config = {
  max_per_author: 2
};

async function getTrendingFeed(languages, limit = 750, query = {}, skip = 0) {

  const author_video_count = {};

  function getAuthorVideoCount(author) {

    return author_video_count[author] || 0

  }

  function incrementAuthorVideoCount(author) {

    if (!author_video_count[author]) {

      author_video_count[author] = 0

    }

    author_video_count[author] += 1

  }

  let feed = [];

  var today = new Date();
  var lastWeekStart = today.setDate(today.getDate() - 7);

  const trending = await mongo.Video.find(Object.assign({
    status: 'published',
    created: {$gt: lastWeekStart},
    language: {$in: languages},
    score: {$gt: 0},
    pinned: false
    // owner: {$nin: ["tommyrobinson", "nuoviso", "rairfoundation", "tlavagabond", "steemer-sayu907", "jamesgoddard", "neuehorizontetv", "aviyemeni", "ericwilson"]}
  }, query), null, {limit: 750, skip: skip}).sort('-score').cache(30);


  const pinned = await mongo.Video.find(Object.assign({
    status: 'published',
    pinned: true
  }, query), null, {limit: 750}).sort('-created').cache(30);

  feed = feed.concat(pinned)

  for (const index in trending) {

    const video = trending[index];

    if (getAuthorVideoCount(video.owner) < config.max_per_author) {

      if (feed.length < limit) {

        feed.push(video);
        incrementAuthorVideoCount(video.owner)

      }

    }

  }

  // feed = feed.sort((a, b) => {
  //     return b.created - a.created
  // });

  return feed

}

module.exports = getTrendingFeed;
