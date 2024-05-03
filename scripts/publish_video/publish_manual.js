// This script will mark the videos as published which were uploaded by mobile app or any other dApp
// and it was published on blockchain. User may go back to previous screen resulting failure to call the API to mark video as published
// following script will take care of it.

require('../../page_conf')
const { mongo } = require('../../helper');
const { sleep, validateBeneficiaries } = require('./helper');

(async() => {

  console.log('===============================')

  const videos = await mongo.Video.find({
    status: { $in: ['publish_manual'] },
    publishFailed: { $ne: true },
    lowRc: { $ne: true },
    owner: { $ne: 'guest-account' },
    $or: [
      { steemPosted: { $exists: false } }, { steemPosted: false }
    ],
    title: { $ne: null }
  }).sort('-created');
  console.log('## Videos to publish:', videos.length)

  if (videos.length === 0) {
    await sleep(5000)
  }

  for (const video of videos) {
    if (video.duration < 5) {
      console.log(`${video.owner}/${video.permlink} - video length less than 5 seconds not allowed to be published`);
      continue;
    }
    const doesPostHaveValidBeneficiaries = await validateBeneficiaries(video);
    if (doesPostHaveValidBeneficiaries) {
      video.steemPosted = true;
      video.status = "published";
      await video.save();
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
