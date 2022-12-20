require('./page_conf');
const AWS = require('aws-sdk');
const Bucket = WASABI_BUCKET;
const ipfsClient = require('ipfs-http-client')
const mongo = require('./helper/mongo');
const Axios = require('axios')
const GATEWAY_URL = 'https://ipfs-3speak.b-cdn.net';
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: 50 });
const Tmp = require('tmp')
const Path = require('path')
const fs = require('fs')
var ffmpeg = require('fluent-ffmpeg');
AWS.config.httpOptions.timeout = 0;

const s3 = new AWS.S3({
    endpoint: (new AWS.Endpoint(WASABI_ENDPOINT)),
    signatureVersion: 'v4',
    accessKeyId: WASABI_ACCESS_KEY_ID,
    secretAccessKey: WASABI_SECRET_KEY,
    region: WASABI_REGION
});

/*const s3Podcast = new AWS.S3({
    endpoint: (new AWS.Endpoint('s3.us-west-1.wasabisys.com')),
    signatureVersion: 'v4',
    accessKeyId: WASABI_ACCESS_KEY_ID,
    secretAccessKey: WASABI_SECRET_KEY,
    region: 'us-west-1'
}); */

console.log(Bucket)
void (async () => {

    try {
        //const input_data = JSON.parse(fs.readFileSync('./3speak_output.json').toString())
        const input_data = fs.readFileSync('./3speak-missing-files.log.txt').toString().split('\n')
        console.log(input_data.length)
        //console.log(input_data)
        let usableData = [];
        /*for(let input_field of input_data) {
            //console.log(input_field)
            for(let field of Object.values(input_field)[0]) {
                const [owner, permlink] = field.post_url.replace('https://3speak.tv/watch?v=', '').split('/')
                console.log(owner, permlink)
                usableData.push(await mongo.Video.findOne({
                    owner,
                    permlink,
                    status: 'published'
                }))
            }
        }*/
        let promiso = []
        for (let input_field of input_data) {
            const [owner, permlink] = input_field.replace('https://3speak.tv/watch?v=', '').split('/')
            const data = mongo.Video.findOne({
                owner,
                permlink,
                status: 'published',
                podcast_transfered: {$ne: true}
            })
            promiso.push(data)
        }

        for (let promiseData of await Promise.all(promiso)) {
            if(promiseData) {
                usableData.push(promiseData)
            }
        }
        //console.log(usableData)
        console.log(usableData.length)
        //process.exit(0)

        let totalSize = 0
        setInterval(() => {
            console.log(`totalSize; ${totalSize}`)
        }, 10000)
        /*s3.upload({
            Key: "test.txt",
            Body: "insert data",
            Bucket: 'podcast-data',
            ACL: "public-read"
        }, async (err, data) => {
            console.log(err, data)
        })*/
        const runProcess = async (video) => {
            queue.add(async () => {
                try {
                    const data = await s3.listObjectsV2({ Bucket: Bucket, Prefix: video.permlink, MaxKeys: 100000 }).promise()
                    let dataMap = [];
                    data.Contents.forEach(e => {
                        //console.log(e)
                        if (e.Key.endsWith(video.filename)) {
                            //console.log(e)
                            dataMap.push({
                                path: e.Key.replace(video.permlink + '/', ''),
                                url: `${APP_VIDEO_CDN_DOMAIN}/` + e.Key,
                                key: e.Key
                            })
                            totalSize = totalSize + e.Size
                        }
                    })
                    if (dataMap.length === 0) {
                        console.log(`video missing data ${video.permlink}`)
                        console.log(`backup url https://threespeakvideo.b-cdn.net/${video.permlink}/480p/index.m3u8`)
                        const workfolder = Tmp.dirSync().name
                        const command = ffmpeg(`https://s3.eu-central-1.wasabisys.com/v--03-eu-west.3speakcontent.online/${video.permlink}/default.m3u8`);
                        command.videoCodec('copy')
                        //command.on('progress', (progress) => {
                        //console.log(progress)
                        //})
                        var promy = new Promise((resolve, reject) => {
                            command
                                .on('end', () => {
                                    resolve(null)
                                })
                                .on('error', (err) => {
                                    reject(err)
                                })

                        })

                        command.save(Path.join(workfolder, 'main.mp4'))

                        console.log(workfolder)

                        await promy
                        await s3.upload({
                            Key: `${video.permlink}/main.mp4`,
                            Body: fs.readFileSync(Path.join(workfolder, 'main.mp4')),
                            Bucket: 'podcast-data',
                            ACL: "public-read",
                        }).promise()
                        video.podcast_transfered = true;
                        await video.save()
                        //fs.unlinkSync(workfolder)
                    }
                    /*for (let data of dataMap) {
                        s3.deleteObject({Bucket: Bucket, Key: data.key}, function (err, data) {
                            if (err) console.log(err, err.stack);  // error
                            else console.log(data);                 // deleted
                        });
                    }*/



                } catch (ex) {
                    console.log(ex)
                }
                //console.log(data)
            })
        }

        for await (let video of usableData) {
            //var command = ffmpeg();

            //console.log(video)
            //console.log(video.permlink)
            runProcess(video)
        }
        await queue.onIdle()
    } catch (ex) {
        console.log(ex)
    }

})()