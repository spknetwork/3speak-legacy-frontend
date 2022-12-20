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
        const input_data = JSON.parse(fs.readFileSync('./3speak_output.json').toString())
        //const input_data = fs.readFileSync('./3speak-missing-files.log.txt').toString().split('\n')
        console.log(input_data.length)
        //console.log(input_data)
        let usableData = [];
        let x = 0;
        for(let input_field of input_data) {
            //console.log(input_field)
            for(let field of Object.values(input_field)[0]) {
                const [owner, permlink] = field.post_url.replace('https://3speak.tv/watch?v=', '').split('/')
                console.log(owner, permlink)
                usableData.push({
                    video_data: await mongo.Video.findOne({
                        owner,
                        permlink,
                        status: 'published'
                    }),
                    encl_url: field.encl_url
                })
                x = x + 1
            }
            
        }
        
        //console.log(usableData)
        console.log(usableData.length)
        //process.exit(0)

        let totalSize = 0
        setInterval(() => {
            console.log(`totalSize; ${totalSize}`)
        }, 10000)
        
        const runProcess = async (video) => {
            queue.add(async () => {
                try {
                    await Axios.head(video.encl_url)
                } catch (ex) {
                    const {video_data} = video
                    video_data.filename = `${video_data.permlink}/${video_data.filename}`
                    await video_data.save()
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