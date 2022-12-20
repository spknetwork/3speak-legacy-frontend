require('./page_conf');
const ipfsClient = require('ipfs-http-client')
const mongo = require('./helper/mongo');
const Axios = require('axios')
const GATEWAY_URL = 'https://ipfs-3speak.b-cdn.net';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 1024});

void (async() => {
    console.log('its starting')
    const ipfs = ipfsClient.create('https://ipfs.3speak.tv');
    const data =  mongo.Video.find({
        status: 'published',
        ipfs: {$ne: null}
    }).skip(20).sort('-created')
    let totalSize = 0;
    let numProc = 0;
    setInterval(() => {
        console.log(`total size so far: ${totalSize}, total processed: ${numProc}`)
    }, 5000)
    for await (let vid of data) {
        //console.log(vid)

        queue.add(async () => {
            /*try {
                await Axios.head(`${GATEWAY_URL}/ipfs/${vid.ipfs}/default.m3u8`) 
                //console.log(`success: ${vid.ipfs} ${vid.owner}/${vid.permlink}`)
                successNum = successNum + 1;
            } catch (ex) {
                failNum = failNum + 1;
                console.log(`failed: ${vid.ipfs} ${vid.owner}/${vid.permlink}`)
                vid.ipfs = null;
                await vid.save()
                //console.log(ex)
                await mongo.Video.findOneAndUpdate(vid, {
                    $set: {
                        ipfs: null
                    }
                })
            }*/
            //console.log(vid.ipfs)
            //for await(let est of ipfs.object.stat(vid.ipfs)) {
            //    console.log(est)
            //}
            const data = await ipfs.object.stat(vid.ipfs)
            totalSize = totalSize + data.CumulativeSize
            numProc = numProc + 1
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
    await queue.onIdle()
    console.log(`totalSize: ${totalSize}, total processed: ${numProc}`)
    process.exit(0)
})()