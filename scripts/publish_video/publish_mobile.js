require('../../page_conf')
const { mongo } = require('../../helper');
const { getOperations, sleep, steemPostExist, tryPublish, shouldSkip } = require('./helper');

(async() => {

  console.log('===============================')

  const videos = await mongo.Video.find({
    status: { $in: ['publish_manual'] },
    title: { $ne: null }
  }).sort('-created');
  console.log('## Videos to publish:', videos.length)

  if (videos.length === 0) {
    await sleep(5000)
  }

  for (const video of videos) {
    const shouldWeSkip = await shouldSkip(video);
    if (shouldWeSkip) {
      continue;
    }
    console.log('===============================')
    console.log('## Publishing Video to HIVE:', video.owner, video.permlink, ' -- ', video.title)
    video.description = `${video.description}\n\n[![appStore](https://i.imgur.com/enwTLng.png)](https://apps.apple.com/us/app/3speak/id1614771373) | [![GooglePlayStore](https://i.imgur.com/6K5fgGX.png)](https://play.google.com/store/apps/details?id=tv.threespeak.app) | [![Support @sagarkothari88](https://i.imgur.com/bTdSCuq.png)](https://hivesigner.com/sign/account-witness-vote?witness=sagarkothari88&approve=1) | [![Support @threespeak](https://i.imgur.com/2cEH8bp.png)](https://hivesigner.com/sign/account-witness-vote?witness=threespeak&approve=1)`;

    try {
      if (!(await steemPostExist(video.owner, video.permlink))) {

        const operations = await getOperations(video)

        const publishAttempt = await tryPublish(operations)

        if (publishAttempt.id) {

          video.steemPosted = true;
          video.lowRc = false;
          video.needsHiveUpdate = !!video.ipfs;
          video.status = 'published';
          await video.save();

          let creator = await mongo.ContentCreator.findOne({ username: video.owner });
          if (creator !== null && creator.hidden === true) {
            creator.hidden = false;
            await creator.save();
          }
          console.log('## Published:', 'https://hiveblocks.com/tx/' + publishAttempt.id, 'https://3speak.co/watch?v=' + video.owner + '/' + video.permlink)
        } else {
          const isLowRc = publishAttempt.message && publishAttempt.message.indexOf('power up') > -1;
          const blockSizeExceeded = publishAttempt.message && publishAttempt.message.indexOf('maximum_block_size') > -1;
          const missingAuthority = publishAttempt.message && publishAttempt.message.indexOf('Missing Posting Authority') > -1;
          const titleException = publishAttempt.message && publishAttempt.message.indexOf('Title size limit exceeded.') > -1;
          const paidForbidden = publishAttempt.message && publishAttempt.message.indexOf('Updating parameters for comment that is paid out is forbidden') > -1;
          const commentBeneficiaries = publishAttempt.message && publishAttempt.message.indexOf('Comment already has beneficiaries specified') > -1;

          video.lowRc = isLowRc;
          video.publishFailed = blockSizeExceeded || missingAuthority || titleException || paidForbidden || commentBeneficiaries

          await video.save()

          console.log('## ERROR:', publishAttempt.message, video.permlink)
        }

      } else {
        video.steemPosted = true;
        await video.save();
        console.log('## SKIPPED. ALREADY PUBLISHED!')
      }
    } catch (ex) {
      console.log(ex)
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
