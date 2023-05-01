require('../../page_conf')
const {mongo} = require('../../helper');
const {getOperations, sleep, steemPostExist, tryPublish, hasPostingAuthority } = require('./helper');

(async() => {

  console.log('===============================')

  let from = new Date();
  from.setDate(from.getDate() - 1);

  const videos = await mongo.Video.find({
    status: { $in: ['published', 'published_manual'] },
    owner: {$ne: 'guest-account'},
    steemPosted: true,
    needsHiveUpdate: true,
    created: {$gt: from}
  });
  console.log('## Videos to publish:', videos.length)

  if (videos.length === 0) {
    await sleep(5000)
  }

  for (const video of videos) {

    if (video.status === 'publish_manual') {
      try {
        let doWeHavePostingAuthority = await hasPostingAuthority(video.owner);
        if (doWeHavePostingAuthority === false) {
          continue;
        }
      }  catch (err) {
        console.error(err + ' - Error while getting account info for ' + video.owner);
        continue;
      }
    }

    console.log('===============================')
    console.log('## Updating hive blog HIVE:', video.owner, video.permlink, ' -- ', video.title)

    if (await steemPostExist(video.owner, video.permlink)) {

      const operations =await getOperations(video, false)

      const publishAttempt = await tryPublish(operations)

      if (publishAttempt.id) {

        video.steemPosted = true;
        video.needsHiveUpdate = false;

        await video.save();

        let creator = await mongo.ContentCreator.findOne({username: video.owner});
        if (creator !== null && creator.hidden === true) {
          creator.hidden = false;
          await creator.save();
        }
        console.log('## Published:', 'https://hiveblocks.com/tx/' + publishAttempt.id, 'https://3speak.co/watch?v=' + video.owner + '/' + video.permlink)
      } else {
        console.log('## ERROR:', publishAttempt.message)
      }
    } else {
      video.needsHiveUpdate = true;
      video.steemPosted = false;
      await video.save();
      console.log('## SKIPPED. NOT ON BLOCKCHAIN YET!')
    }
  }

  process.exit(0)

})();

process.on('uncaughtException', function(error) {
  console.log('===============================')
  console.log('## UNCAUGHT ERROR:', error.message)
  process.exit(1)
});
process.on('unhandledRejection', function(reason, p) {
  console.log('===============================')
  console.log('## UNHANDLED ERROR:', reason)
  process.exit(1)
});
