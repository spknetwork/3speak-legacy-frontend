require('./page_conf');
const ipfsClient = require('ipfs-http-client')
const mongo = require('./helper/mongo');
const Axios = require('axios')
const GATEWAY_URL = 'https://ipfs-3speak.b-cdn.net';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 128});

void (async() => {
    //process.exit(0)
    const data = await mongo.Video.updateMany({
        thumbnail: {
            $regex: 'ipfs://'
        }
    }, {
        needsHiveUpdate: true
    })
    console.log(data)
})()