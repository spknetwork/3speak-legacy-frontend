require('../page_conf')
const mongo = require('./../helper/mongo');
const hive = require('@hiveio/hive-js');
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_SECONDARY_NODE}`});

/*const Sw = 0;
const Viw = 0.1;*/
const Vw = 0.1;

/*const Dw = 0.06;
const Cw = 0.1;*/

function getScore(subs, videos, views, donations, avgViews, avgComments, comments) {

  if (videos < 3) {
    return 0
  }
  return (views * Vw) + (avgComments * 3)


}

async function getCommentCount(author, permlink) {
  return 0;
}

(async () => {

  let ago = new Date();
  ago.setMonth(ago.getMonth() - 1);


  const videosAll = await mongo.Video.aggregate([
    {
      $match: {
        status: 'published'
        /*created: {$gt: ago}*/
      }
    },
    {
      $project: {
        owner: 1,
        _id: 1,
        created: 1
      }
    }, {
      $group: {
        _id: null,
        creator: {$addToSet: '$owner'}
      }
    }
  ]);

  await mongo.ContentCreator.updateMany({}, {$set: {score: 0}})

  let creators = videosAll[0].creator;

  for (let creator of creators) {

    if (creator === 'guest-account') {
      await mongo.ContentCreator.updateOne({username: creator}, {$set: {score: 0}})
      continue;
    }

    const videos = await mongo.Video.find({
      owner: creator,
      status: 'published',
      created: {$gt: ago}
    });

    let views = 0;
    let comments = 0;

    for (let video of videos) {
      views += video.views || 0
      comments += await getCommentCount(video.owner, video.permlink)
    }

    let avgViews = views / videos.length;
    let avgComments = comments / videos.length

    const subs = 0//await mongo.Subscription.countDocuments({channel: creator});


    let score = getScore(subs, videos.length, views, 0, avgViews, avgComments, comments);
// console.log(creator, score)
    // creator[i].score = score;
    //
    // await creator[i].save();

    if (isNaN(score)) {
      score = 0;
    }

    await mongo.ContentCreator.updateOne({username: creator}, {$set: {score}})

    console.table({
      creator: creator,
      score,
      subs,
      videos: videos.length,
      views,
      avgViews,
      comments,
      avgComments,
      donations: 0
    });

  }

  process.exit(0);

})();

process.on('uncaughtException', function (error) {
  console.log(error)
  process.exit(1)
});
process.on('unhandledRejection', function (reason, p) {
  console.log(reason)
  process.exit(1)
});

// NEW_LAYOUT = 1;
// SET ENV = dev;
// SET MONGO_HOST = 127.0.0.1;
// SET DEBUG = threespeak;
// SET HOST = http://localhost:9400;
// SET MEMCACHED_HOST=localhost:11211;
// SET REDIS_HOST=redis://localhost:6379
