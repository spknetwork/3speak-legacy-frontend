require("../page_conf");
const { mongo } = require("../helper");
const shell = require("shelljs");
const fs = require("fs");
const probe = require("probe-image-size");

async function generateThumb(url, author, permlink) {
  return new Promise((resolve, reject) => {
    const command = `ffprobe -i  ${url} -show_entries stream=width,height -of json=compact=1 -v error`;
    shell.exec(command, { async: false }, (code, stdout, stderr) => {
      const result = JSON.parse(stdout.toString());
      console.log(JSON.stringify(result));
      return resolve({
        width: result.streams[0].width,
        height: result.streams[0].height,
      });
    });
  });
}

(async () => {
  const videos = await mongo.Video.find({
    status: { $in: ["published"] },
    steemPosted: true,
    width: { $eq: null },
    height: { $eq: null },
  })
    .limit(1)
    .sort("-created");

  for (const video of videos) {
    console.log(`================================`);
    console.log(
      `Started for @${video.owner}/${video.permlink} - ${Date.now().toString()}`
    );
    let playUrl;
    if (video.upload_type === "ipfs") {
      playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.video_v2.replace(
        "ipfs://",
        ""
      )}`;
    } else {
      playUrl = `${APP_VIDEO_CDN_DOMAIN}/${video.permlink}/default.m3u8`;
    }
    const result = await generateThumb(
      playUrl.replace("manifest.m3u8", "480p/index.m3u8"),
      video.owner,
      video.permlink
    );
    video.width = result.width;
    video.height = result.height;
    await video.save();
    console.log(
      `Ended for @${video.owner}/${video.permlink} - ${Date.now().toString()}`
    );
  }

  process.exit(0);
})();
