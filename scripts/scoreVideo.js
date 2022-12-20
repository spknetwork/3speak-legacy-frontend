require('../page_conf')
const mongo = require('./../helper/mongo');
const hive = require('@hiveio/hive-js');

hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_SECONDARY_NODE}`});

function getScore(views, age, payout, donations) {
  const Vw = 0.25;
  const Aw = 0.25;
  const Pw = 0.2;
  const Dw = 0.5;

  return (views * Vw) + (payout * Pw) + (donations * Dw) - (((age / 60 / 3600) ** 25) * Aw)
}

(async() => {

  let today = new Date();
  let eightDaysAgo = today.setDate(today.getDate() - 8);

  const videos = await mongo.Video.find({status: 'published', created: {$gte: eightDaysAgo}});
  const creators = await mongo.ContentCreator.find({banned: false, hidden: false});
  let ccFrom = [];

  for (let i in creators) {
    ccFrom.push('oauth2|Steemconnect|' + creators[i].username)
  }


  for (let i in videos) {
    const views = await mongo.View.countDocuments({permlink: videos[i].permlink});


    let count = 0;
    let payout = 0;

    var a = new Date();

    var b = videos[i].created;
    var age = (a - b) / 1000;
    let score = getScore(views, age, payout, count);

    if (videos[i].score_boost) {
      score = score * (1 + videos[i].score_boost / 100)
    }

    if (isNaN(score)) {
      score = 0;
    }

    videos[i].score = score;
    if (videos[i].owner === 'guest-account') {
      videos[i].score = 0;
    }

    await videos[i].save();
    console.log('> Scored:', videos[i].owner, '/', videos[i].permlink, 'with', videos[i].score);
  }

  process.exit(0);

})();

process.on('uncaughtException', function(error) {
  console.log(error)
  process.exit(1)
});
process.on('unhandledRejection', function(reason, p) {
  console.log(reason, p)
  process.exit(1)
});
