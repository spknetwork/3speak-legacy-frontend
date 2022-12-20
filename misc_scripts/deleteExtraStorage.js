require('../page_conf')
const AWS = require('aws-sdk');
const mongo = require('../helper/mongo');
const WebSocket = require('ws');
const Bucket = WASABI_BUCKET;

const s3 = new AWS.S3({
    endpoint: (new AWS.Endpoint(WASABI_ENDPOINT)),
    signatureVersion: 'v4',
    accessKeyId: WASABI_ACCESS_KEY_ID,
    secretAccessKey: WASABI_SECRET_KEY,
    region: WASABI_REGION
});



void (async () => {
    let thirtyMinsAgo = (new Date()).setDate((new Date()).getDate() - 1)
    let yesterday = (new Date()).setDate((new Date()).getDate() - 100)
    console.log(new Date(thirtyMinsAgo), new Date(yesterday))
    //let videos = await mongo.Video.find({ created: { $gt: yesterday } })
    let videos = await mongo.Video.find({ status: 'deleted' })
    //console.log(videos)
    let totalSize = 0
    setInterval(() => {
        console.log(`totalSize; ${totalSize}`)
    }, 10000)
    for (let video of videos) {

        await s3.listObjectsV2({ Bucket: Bucket, Prefix: video.permlink, MaxKeys: 100000 }, async function (err, data) {
            //console.log(data)
            if (!err) {
                let dataMap = [];
                data.Contents.forEach(e => {
                    //console.log(e)
                    //if (e.Key.endsWith('480p.mp4') || e.Key.endsWith('720p.mp4') || e.Key.endsWith('1080p.mp4')) {
                    //console.log(e)
                    dataMap.push({
                        path: e.Key.replace(video.permlink + '/', ''),
                        url: `${APP_VIDEO_CDN_DOMAIN}/` + e.Key,
                        key: e.Key
                    })
                    totalSize = totalSize + e.Size
                    //}
                })

                //console.log(dataMap)
                for (let data of dataMap) {
                    //console.log(data)
                    await new Promise((resolve, reject) => {
                        s3.deleteObject({ Bucket: Bucket, Key: data.key }, function (err, data) {
                            if (err) {
                                console.log(err, err.stack);  // error
                                reject(err)
                            } else {
                                console.log(data);                 // deleted
                                resolve(data)
                            }
                        });
                    })
                }


            } else {
                console.log(err)
            }
        });

    }
})()