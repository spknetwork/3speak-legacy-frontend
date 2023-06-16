require("../../page_conf");
const { mongo } = require("../../helper");
const { sleep, steemPostExist } = require("./helper");

(async () => {
  console.log("===============================");

  const videos = await mongo.Video.find({
    status: { $in: ["publish_manual"] },
    title: { $ne: null },
  }).sort("-created");

  if (videos.length === 0) {
    process.exit(0);
  }

  for (const video of videos) {
    try {
      console.log(`Checking for @${video.owner}/${video.permlink}`)
      if (await steemPostExist(video.owner, video.permlink)) {
        console.log(`## Video already published: @${video.owner}/${video.permlink}`);
        video.steemPosted = true;
        video.lowRc = false;
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
