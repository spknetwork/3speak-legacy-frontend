const { config } = require("../config/index.js");
require('../page_conf')
const fs = require('fs');
const mongo = require('./../helper/mongo');
const AWS = require('aws-sdk');
const randomstring = require('randomstring');
const ep = new AWS.Endpoint('s3.eu-central-1.wasabisys.com');
const s3 = new AWS.S3({
    endpoint: ep,
    signatureVersion: 'v4',
    accessKeyId: config.awsEuroId,
    secretAccessKey: config.awsEuroAccessKey,
    region: 'eu-central-1'
});

(async() => {

    const partneruploads = await mongo.UploadAPIVideo.find({status: 'uploaded'})

    for (const i in partneruploads) {

        const upload = partneruploads[i];

        await s3.upload({
            Key: upload.app + '/' + upload.for_channel + '/' + upload.file_local,
            Body: require('fs').readFileSync(__dirname + '/upload/' + upload.file_local),
            Bucket: 'threespeak-partner',
            ContentType: 'video/mp4'
        }).promise()

        const video = new mongo.Video();
        const videoCount = await mongo.Video.countDocuments({owner: upload.for_channel});
        if (videoCount === 0) {

            video.firstUpload = true;

}
        video.filename =  upload.file_local;
        video.app = upload.app;
        video.originalFilename = upload.file_local;
        video.permlink = randomstring.generate({
            length: 8,
            charset: 'alphabetic'
        }).toLowerCase();
        video.duration = upload.duration;
        video.size = parseFloat(upload.size);
        video.owner = upload.for_channel;

        video.title = upload.title;
        video.description = upload.description;
        video.tags = upload.tags.join(',');
        video.thumbnail = '';
        video.is3CJContent = false;
        video.category = 'general';
        video.language = 'en';
        video.community = null;
        video.hive = 'hive-100421';
        video.status = 'encoding_queued';

        await video.save();
        upload.status = 'processed';
        await upload.save();

        fs.unlinkSync(__dirname + '/upload/' + upload.file_local)

        console.log('PREPARED VIDEO:', video)

    }


})()
