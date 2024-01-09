require('../../page_conf')
const { mongo } = require('../../helper');
const { getOperations, sleep, steemPostExist, tryPublish, shouldSkip } = require('./helper');
const moment = require('moment');

(async() => {
  const audios = await mongo.PodcastEpisode.find({
    status: { $in: ['publish_manual'] },
    title: { $ne: null }
  }).sort('-created');
  console.log('## Podcast episodes to publish:', videos.audios)
  if (audios.length === 0) {
    process.exit(0)
  }
  for (const audio of audios) {
    try {
      if (await steemPostExist(audio.owner, audio.permlink)) {
        audio.status = 'published';
        await audio.save();
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
