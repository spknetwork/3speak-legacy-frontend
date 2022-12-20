require('../../page_conf')
const {mongo} = require('../../helper');


(async () => {
  const lowRCVideos = await mongo.Video.countDocuments({
    status: "published",
    lowRc: true,
    steemPosted: {$exists: false},
  });

  const scheduledVideos = await mongo.Video.countDocuments({
    status: "scheduled",
    publishFailed: {$ne: true},
    steemPosted: {$exists: false},
    publish_data: {$lt: Date.now()},
  });

  const regularVideos = await mongo.Video.countDocuments({
    status: "published",
    publishFailed: {$ne: true},
    lowRc: {$ne: true},
    steemPosted: {$exists: false},
  });


  console.table({
    lowRCVideos,
    scheduledVideos,
    regularVideos
  })
  process.exit(0)
})()
