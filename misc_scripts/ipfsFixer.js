require('./page_conf');
const ipfsClient = require('ipfs-http-client')
const mongo = require('./helper/mongo');
const Axios = require('axios')
const GATEWAY_URL = 'https://ipfs-3speak.b-cdn.net';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 128});

void (async() => {
    console.log('its starting')
    const ipfs = ipfsClient.create();
    const data =  mongo.Video.find({
        status: 'published',
        ipfs: {$ne: null}
    }).skip(20).sort('-created')
    let successNum = 0;
    let failNum = 0;
    setInterval(() => {
        console.log(`success: ${successNum}, fail: ${failNum}`)
    }, 5000)
    process.exit(0) // safety
    for await (let vid of data) {
        //console.log(vid)

        queue.add(async () => {
            try {
                await Axios.head(`${GATEWAY_URL}/ipfs/${vid.ipfs}/default.m3u8`) 
                //console.log(`success: ${vid.ipfs} ${vid.owner}/${vid.permlink}`)
                successNum = successNum + 1;
            } catch (ex) {
                failNum = failNum + 1;
                console.log(`failed: ${vid.ipfs} ${vid.owner}/${vid.permlink}`)
                vid.ipfs = null;
                await vid.save()
                //console.log(ex)
                /*await mongo.Video.findOneAndUpdate(vid, {
                    $set: {
                        ipfs: null
                    }
                })*/
            }
        })
        
        /*let numProvs = 0;
        for await(let prov of ipfs.dht.findProvs(vid.ipfs, {timeout: 15000})) {
            console.log(prov.id.toString())
            numProvs = numProvs + 1;
            continue;
        }
        if(numProvs === 0) {
            console.log(`failed: ${vid.ipfs} ${vid.owner}/${vid.permlink}`)
        }*/
    }
    console.log(`success: ${successNum}, fail: ${failNum}`)
    process.exit(0)
})()