require('../page_conf')
const AWS = require('aws-sdk');
const mongo = require('../helper/mongo');
const WebSocket = require('ws');
const Bucket = WASABI_BUCKET;

const ws = new WebSocket('wss://ipfs.3speak.tv/urlstore');
const s3 = new AWS.S3({
  endpoint: (new AWS.Endpoint(WASABI_ENDPOINT)),
  signatureVersion: 'v4',
  accessKeyId: WASABI_ACCESS_KEY_ID,
  secretAccessKey: WASABI_SECRET_KEY,
  region: WASABI_REGION
});

(async() => {
  let thirtyMinsAgo = (new Date()).setMinutes((new Date()).getMinutes() - 30)
  let yesterday = (new Date()).setDate((new Date()).getDate() - 1)
  let videos = await mongo.Video.find({ipfs: null, created: {$lt: thirtyMinsAgo, $gt:yesterday}})
  let existingChunks = await mongo.ChunkJob.distinct('permlink')

  console.log(existingChunks)

  process.exit(0); // Disable for now!

  for (let video of videos) {
    if (existingChunks.includes(video.permlink)) {
      console.log('continue')
      continue
    }
    await s3.listObjectsV2({Bucket: Bucket, Prefix: video.permlink, MaxKeys: 100000}, async function(err, data) {
      console.log(data)
      if (!err) {
        let dataMap = [];
        data.Contents.forEach(e => {
          if (e.Key.endsWith('.ts') || e.Key.endsWith('.m3u8')) {
            dataMap.push({
              path: e.Key.replace(video.permlink + '/', ''),
              url: `${APP_VIDEO_CDN_DOMAIN}/` + e.Key
            })
          }
        })
        dataMap.push({
          url: `${APP_IMAGE_CDN_DOMAIN}/${video.permlink}/thumbnails/default.png`,
          path: 'thumbnail.png'
        })

        console.log(dataMap)

        let jobID = Math.random()
        let wsRequest = JSON.stringify({
          action: 'urlstore.add',
          files: dataMap,
          jobID
        })
        ws.send(wsRequest)
        let chunkJob = new mongo.ChunkJob({
          permlink: video.permlink,
          job_id: jobID
        })
        await chunkJob.save()
      } else {
        console.log(err)
      }
    });
  }
  //process.exit(0)
})()
