require("../../page_conf");
const { mongo } = require("../../helper");
const {
  getOperations,
  sleep,
  steemPostExist,
  tryPublish,
  shouldSkip,
} = require("./helper");
const moment = require("moment");

(async () => {
  console.log("===============================");

  const videos = await mongo.Video.find({
    status: { $in: ["publish_manual"] },
    title: { $ne: null },
  }).sort("-created");
  console.log("## Videos to publish:", videos.length);

  if (videos.length === 0) {
    await sleep(5000);
  }

  for (const video of videos) {
    try {
      if (await steemPostExist(video.owner, video.permlink)) {
        video.steemPosted = true;
        video.lowRc = false;
        video.needsHiveUpdate = !!video.ipfs;
        video.status = "published";
        await video.save();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  process.exit(0);
})();

process.on("uncaughtException", function (error) {
  console.log("===============================");
  console.log("## UNCAUGHT ERROR:", error.message);
  process.exit(1);
});
process.on("unhandledRejection", function (reason, p) {
  console.log("===============================");
  console.log("## UNHANDLED ERROR:", reason);
  process.exit(1);
});
