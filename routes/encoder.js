var express = require('express');
var router = express.Router();
const {mongo, rabbit} = require('../helper');
const WebSocket = require('ws');
const AWS = require('aws-sdk');
const Bucket = WASABI_BUCKET;
const s3 = new AWS.S3({
  endpoint: (new AWS.Endpoint(WASABI_ENDPOINT)),
  signatureVersion: 'v4',
  accessKeyId: WASABI_ACCESS_KEY_ID,
  secretAccessKey: WASABI_SECRET_KEY,
  region: WASABI_REGION
});

let ws

function connect_ipfs() {
  ws = new WebSocket('wss://ipfs.3speak.tv/urlstore');
  console.log('websocket created')

  ws.on('error', (error) => {
    console.log(error)
    ws.close()
  })
  ws.on('close', function close() {
    setTimeout(() => {
      connect_ipfs()
    }, 1000)
  });
  ws.on('open', function open() {
    ws.on('message', async(event) => {
      event = JSON.parse(event)
      if (event.action === 'urlstore.complete') {
        event.jobID = event.jobID.toString()
        let job = await mongo.ChunkJob.findOneAndDelete({job_id: event.jobID})
        await mongo.Video.updateOne({permlink: job.permlink}, {$set: {ipfs: event.cid, needsHiveUpdate: true}})
      }
    })

    // ws.send(JSON.stringify({
    //   action: 'auth',
    //   username: 'encoder',
    //   password: 'j9ra99RYQKkuGu'
    // }))
  })
}

//connect_ipfs()

function getBucket() {

  return Bucket

}

function getPrefix(video) {

  return video.app ? video.app + '/' + video.owner + '/' : ''

}

function getS3DownloadUrl(job, type) {

  const signedUrlExpireSeconds = 60 * 6 * 72;

  let key = getPrefix(job);
  key += type === 'video' ? job.filename : job.thumbnail
  return s3.getSignedUrl('getObject', {
    Bucket: getBucket(job),
    Key: key,
    Expires: signedUrlExpireSeconds
  });

}

router.get('/finishJob', async(req, res) => {

  const secret = req.query.secret;
  if (secret !== ENCODER_SECRET) {

    return res.sendStatus(401).end()

  }

  const job = await mongo.Video.findOne({status: 'encoding', permlink: req.query.permlink});

  if (job === null) {

    return res.json({error: 'already published'})

  }

//   try {
//
//     if (job.receipt && job.receipt !== '') {
//
//       const data = await rabbit.ack(JSON.parse( job.receipt))
//       console.log("ACK", data)
//       job.receipt = ''
//
//     }
//
//   } catch (e) {
// console.log("Empty receipt!")
//     job.receipt = ''
//
//   }

  job.status = job.publish_type === 'publish' ? 'published' : 'scheduled';
  job.created = Date.now();

  // const message = {
  //   filename: job.filename,
  //   permlink: job.permlink,
  //   title: job.title
  // }


  //await rabbit.store('torrent_creation', message)
  job.save()

  await s3.listObjectsV2({Bucket: Bucket, Prefix: job.permlink, MaxKeys: 100000}, function(err, data) {
    if (!err) {
      let dataMap = [];
      data.Contents.forEach(e => {
        if (e.Key.endsWith('.ts') || e.Key.endsWith('.m3u8')) {
          dataMap.push({
            path: e.Key.replace(job.permlink + '/', ''),
            url: `${APP_VIDEO_CDN_DOMAIN}/` + e.Key
          })
        }
      })
      dataMap.push({
        url: `${APP_IMAGE_CDN_DOMAIN}/${job.permlink}/thumbnails/default.png`,
        path: 'thumbnail.png'
      })

      let jobID = Math.random()
      let wsRequest = JSON.stringify({
        action: 'urlstore.add',
        files: dataMap,
        jobID
      })
      // ws.send(wsRequest)
      let chunkJob = new mongo.ChunkJob({
        permlink: job.permlink,
        job_id: jobID
      })
      chunkJob.save()
    }
  });


  res.json({})
});

router.get('/failJob', async(req, res) => {

  const secret = req.query.secret;
  if (secret !== ENCODER_SECRET) {

    return res.sendStatus(401).end()

  }

  const job = await mongo.Video.findOne({status: 'encoding', permlink: req.query.permlink});

  if (job === null) {

    return res.json({})

  }

  // if (job.receipt && job.receipt !== '') {
  //
  //   await rabbit.ack(JSON.parse(job.receipt))
  //   job.receipt = ''
  // }


  job.status = 'encoding_failed';

  await job.save();

  return res.json({})


});

router.get('/requestJob', async(req, res) => {

  try {
    const secret = req.query.secret;
    if (secret !== ENCODER_SECRET) {
      return res.sendStatus(401).end()
    }

    //let job = await rabbit.consume('video_encoding')

    // if (job === false) {
    //
    //   return res.json({})
    //
    // }
    //
    // job = JSON.parse(job.content.toString())
    let since = new Date()
    since = since.setDate(since.getDate() - 30)
    let job = await mongo.Video.findOneAndUpdate({status: 'encoding_queued', created: {$gt: since}}, {$set: {status: 'encoding'}});

    if (job === false) {
      return res.json({})
    }

    res.json({
      permlink: job.permlink,
      video_url: getS3DownloadUrl(job, 'video'),
      thumbnail_url: getS3DownloadUrl(job, 'thumbnail')
    })
  } catch (e) {
    console.log(e);
    res.json({})
  }
});
// router.get('/requestJobAudio', async(req, res) => {
//
//   const secret = req.query.secret;
//   if (secret !== ENCODER_SECRET) {
//
//     return res.sendStatus(401).end()
//
//   }
//
//   let job = await aws.helper.receiveMessage('video2mp3')
//
//   if (!job.Messages) {
//
//     return res.json({})
//
//   }
//   const receipt = job.Messages[0].ReceiptHandle
//   job = JSON.parse(job.Messages[0].Body)
//   await mongo.Video.updateOne({permlink: job.permlink}, {$set: {audio_status: 'encoding', receipt}});
//
//
//   res.json({
//     permlink: job.permlink,
//     video_url: getS3DownloadUrl(job, 'video'),
//     thumbnail_url: getS3DownloadUrl(job, 'thumbnail')
//   })
//
// });


module.exports = router;
