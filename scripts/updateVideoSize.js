require("../page_conf");
const { default: PQueue } = require("p-queue");
const { mongo } = require("../helper");

const queue = new PQueue({ concurrency: 100 });

const axios = require('axios');

async function getVideoSize(url) {
  const text = await axios.get(url);
  console.log("================================================");
  const textData = text.data;
  console.log(textData);
  let regex = /RESOLUTION=(.+),/g;
  let found = textData.match(regex);
  if (found === null || found.length === 0) {
    regex = /RESOLUTION=(.+)\n/g;
    found = textData.match(regex);
  }
  const size = found[0].replace('RESOLUTION=', '').replace(',', '').replace('\n', '');
  console.log(`Size ${size}`);
  const sizeComps = size.split(`x`);
  return {
    width: parseInt(sizeComps[0]),
    height: parseInt(sizeComps[1]),
  }
}

function getVideoPlayUrl(video) {
  let playUrl;
  if (video.upload_type === "ipfs") {
    playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.video_v2.replace(
      "ipfs://",
      ""
    )}`;
  } else {
    playUrl = `${APP_VIDEO_CDN_DOMAIN}/${video.permlink}/default.m3u8`;
  }
  console.log(playUrl);
  // playUrl = playUrl.replace("manifest.m3u8", "480p/index.m3u8");
  return playUrl;
}

async function updateVideoSizeTask(video) {
  const startDate = Date.now();
  const playUrl = getVideoPlayUrl(video);
  try {
    const result = await getVideoSize(playUrl);
    video.width = result.width;
    video.height = result.height;
    await video.save();
    const endDate = Date.now();
    const date_diff = Math.abs(startDate - endDate) / 1000.0;
    console.log(
      `@${video.owner}/${video.permlink}, width: ${result.width}, height: ${result.height},  Time: ${date_diff} seconds`
    );
  } catch (e) {
    console.error(e);
  }
}

(async () => {
  const videos = await mongo.Video.find({
    status: { $in: ["published"] },
    steemPosted: true,
    width: { $eq: null },
    height: { $eq: null },
  })
    .limit(10000)
    .sort("-created");

  for (const video of videos) {
    queue.add(async () => await updateVideoSizeTask(video));
  }
})();
