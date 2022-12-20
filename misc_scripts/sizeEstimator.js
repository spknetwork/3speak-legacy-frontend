require('../page_conf');
const ipfsClient = require('ipfs-http-client')
const mongo = require('../helper/mongo');
const Axios = require('axios')
const GATEWAY_URL = 'https://ipfs-3speak.b-cdn.net';
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: 128 });

void (async () => {
    console.log(await mongo.Video.countDocuments({

    }))
    console.log('starting up')
    const data = mongo.Video.find({
        //created: {$gt: new Date('2021-12-13T19:09:02.561Z')}
        owner: {$ne: 'threespeak'},
        status: 'published'
        //created: {
            //$gte: new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))
        //}
    
    }).cursor()
    let totalSize = 0;
    for await(let video of data) {
        //console.log(video)
        totalSize = totalSize + video.size
    }
    console.log(totalSize)
    console.log('starting done')
}) ()