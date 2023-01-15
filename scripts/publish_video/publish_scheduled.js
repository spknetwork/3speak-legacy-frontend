require('../../page_conf')
const {mongo} = require('../../helper');
const {getOperations, sleep, steemPostExist, tryPublish} = require('./helper');

(async () => {

  console.log("===============================")

  const videos = await mongo.Video.find({
      status: "scheduled",
      publishFailed: {$ne: true},
      steemPosted: {$exists: false},
      publish_data: {$lt: Date.now()},
  });
  console.log("## Videos to publish:", videos.length)

  if (videos.length === 0) {
    await sleep(5000)
  }

  for (const video of videos) {

    console.log("===============================")
    console.log("## Publishing Video to HIVE:", video.owner, video.permlink, " -- ", video.title)

    if (!(await steemPostExist(video.owner, video.permlink))) {

      const operations = await getOperations(video)

      const publishAttempt = await tryPublish(operations)

      if (publishAttempt.id) {

        video.steemPosted = true;
        video.status = 'published';
        video.created = video.publish_data;
        video.lowRc = false;
        video.needsHiveUpdate = !!video.ipfs;

        await video.save();

        let creator = await mongo.ContentCreator.findOne({username: video.owner});
        if (creator !== null && creator.hidden === true) {
          creator.hidden = false;
          await creator.save();
        }
        console.log("## Published:", "https://hiveblocks.com/tx/" + publishAttempt.id, 'https://3speak.co/watch?v=' + video.owner + "/" + video.permlink)
      } else {

        const isLowRc = publishAttempt.message && publishAttempt.message.indexOf("power up") > -1;
        const blockSizeExceeded = publishAttempt.message && publishAttempt.message.indexOf('maximum_block_size - 256') > -1;
        const missingAuthority = publishAttempt.message && publishAttempt.message.indexOf("Missing Posting Authority") > -1;

        video.lowRc = isLowRc;
        video.publishFailed = blockSizeExceeded || missingAuthority

        await video.save();

        console.log("## ERROR:", publishAttempt.message)
      }
    } else {
      video.steemPosted = true;
      video.status = 'published';
      await video.save();
      console.log("## SKIPPED. ALREADY PUBLISHED!")
    }
  }

  process.exit(0)

})();

process.on('uncaughtException', function (error) {
  console.log("===============================")
  console.log("## UNCAUGHT ERROR:", error.message)
  process.exit(1)
});
process.on('unhandledRejection', function (reason, p) {
  console.log("===============================")
  console.log("## UNHANDLED ERROR:", reason)
  process.exit(1)
});
