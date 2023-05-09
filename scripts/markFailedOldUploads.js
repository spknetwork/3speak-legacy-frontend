require('../page_conf')
const {mongo} = require('../helper');

async function updateOldUploadsAsFailed() {
  let d = new Date();
  console.log('Today is: ' + d);
  d.setDate(d.getDate() - 2);
  const filter = {
    status: 'publish_manual',
    created: {
        $lt: d,
    }
  };
  console.log(`Starting query`);
  const videos = await mongo.Video.find(filter);
  console.log(`Length of videos: ${videos.length}`);
  console.log(`================================================`);
  for (let video of videos) {
    const permlink = video.permlink;
    if (permlink === undefined) {
      continue;
    }
    try {
      console.log(`getting the data for - @${video.owner}/${permlink}`);
      video.status = `encoding_failed`;
      await video.save();
    } catch (e) {
      console.error(`${permlink} failed to delete folder - ${e}`);
    }
  }
  console.log(`Existing now`);
}

updateOldUploadsAsFailed();