require("../page_conf");
const { default: PQueue } = require("p-queue");
const { mongo } = require("../helper");
const shell = require("shelljs");

const queue = new PQueue({ concurrency: 40 });

async function getVideoSize(url) {
  return new Promise((resolve, reject) => {
    const command = `ffprobe -i  ${url} -show_entries stream=width,height -of json=compact=1 -v error`;
    shell.exec(command, { async: false }, (code, stdout, stderr) => {
      const result = JSON.parse(stdout.toString());
      if (result.streams === undefined) {
        throw new Error(`Didn't find data for video ${url}`);
      }
      return resolve({
        width: result.streams[0].width,
        height: result.streams[0].height,
      });
    });
  });
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
  playUrl = playUrl.replace("manifest.m3u8", "480p/index.m3u8");
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
    .limit(1000)
    .sort("-created");

  for (const video of videos) {
    queue.add(async () => await updateVideoSizeTask(video));
  }
})();
