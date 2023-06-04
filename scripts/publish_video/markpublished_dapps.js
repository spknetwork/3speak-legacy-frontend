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
    await sleep(5000);
  }

  for (const video of videos) {
    await sleep(1000);
    try {
      if (await steemPostExist(video.owner, video.permlink)) {
        console.log(`## Videos already published: @${video.owner}/${video.permlink}`);
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
