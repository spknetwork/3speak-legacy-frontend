require("../../page_conf");
const { MongoClient } = require("mongodb");
const { mongo } = require("../../helper");
const {
  getOperations,
  sleep,
  steemPostExist,
  tryPublish,
} = require("./helper");

(async () => {
  console.log("===============================");
  const host = APP_MONGO_HOST;
  const client = await MongoClient.connect('mongodb://' + host);
  
  const videos = await mongo.Video.find({
    status: "published",
    owner: { $ne: "guest-account" },
    title: { $ne: null },
    video_v2: { $exists: false },
    job_id: { $exists: true },
  }).sort("-created");

  console.log("## Videos published without video_v2:", videos.length);

  if (videos.length === 0) {
    await sleep(5000);
  }

  for (const video of videos) {
    console.log("===============================");
    const filter = {
      id: video.job_id,
      "result.cid": { $exists: true },
    };
    const coll = client.db("spk-encoder-gateway").collection("jobs");
    const cursor = coll.find(filter);
    const result = await cursor.toArray();
    if (result.length > 0) {
      video.video_v2 = `ipfs://${result[0].result.cid}/manifest.m3u8`;
      console.log(`Setting video_v2 - @${video.owner}/${video.permlink} video_v2 = ${video.video_v2}`)
      await video.save()
    }
  }
  await client.close();
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
