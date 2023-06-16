require("../page_conf");
const { mongo } = require("../helper");
const shell = require("shelljs");
const fs = require("fs");
const probe = require("probe-image-size");

async function generateThumb(url, author, permlink) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -y -i ${url} -vframes 1 ./scripts/updateVideoSizeThumbs/${author}_${permlink}.jpg`;
    console.log(command);
    shell.exec(command, { async: false }, (code, stdout, stderr) => {
      return resolve(true);
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
    .limit(1000)
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
    await generateThumb(
      playUrl.replace("manifest.m3u8", "480p/index.m3u8"),
      video.owner,
      video.permlink
    );
    const filePath = `./scripts/updateVideoSizeThumbs/${video.owner}_${video.permlink}.jpg`;
    if (fs.existsSync(filePath)) {
      let result = await probe(require("fs").createReadStream(filePath));
      video.width = result.width;
      video.height = result.height;
      await video.save();
      fs.unlinkSync(filePath);
    }
    console.log(
      `Ended for @${video.owner}/${video.permlink} - ${Date.now().toString()}`
    );
  }

  process.exit(0);
})();
