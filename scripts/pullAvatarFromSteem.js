const { config } = require("../config/index.js");
require('../page_conf');
const mongo = require('./../helper/mongo');
const hive = require('@hiveio/hive-js');
const request = require('request-promise');
const fs = require('fs');
const md5 = require('md5');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretAccessKey,
    region: 'eu-west-1'
});

function getAvatarHash(username) {

    return md5('oauth2|Steemconnect|' + username)

}

async function doesAvatarExist(hash) {

    var params = {
        Bucket: '3speak-profile',
        Key: hash + '.png'
    };
    const file = s3.getObject(params).promise();
    return file;

}

async function isAvatarAvailable(url) {

    const options = {
        method: 'HEAD',
        uri: url
    };
    return request(options);

}

async function downloadImage(url) {

    const getImageOptions = {
        url: url,
        encoding: null,
        resolveWithFullResponse: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36'
        }
    };

    const image = await request.get(getImageOptions);
    fs.writeFileSync('avatar.png', image.body, {encoding: 'binary'})

}

async function getAvatar(username) {

    const [account] = await hive.api.getAccountsAsync([username]);

    let metadata;
    let avatarUrl = null;
    try {

        metadata = JSON.parse(account.json_metadata)

} catch (error) {

        metadata = {}

}

    if (metadata.profile &&
        metadata.profile.profile_image &&
        metadata.profile.profile_image.match(/^https?:\/\//)) {

        avatarUrl = metadata.profile.profile_image

}

    if (avatarUrl !== null && avatarUrl.indexOf('robohash.org') > -1) {

        avatarUrl = null;

}

    if (avatarUrl !== null) {

        try {

            await isAvatarAvailable(avatarUrl)

} catch (e) {

            avatarUrl = null

}

}
    return avatarUrl

}

module.exports = {
    pullAvatar: async(req, res, next) => {

        const url = await getAvatar(req.query.username);
        if (url !== null) {

            const hash = getAvatarHash(req.query.username);
            try {

                const dump = await doesAvatarExist(hash);
                // console.log("Avatar exists for:", req.query.username);
                res.status(200).end();

} catch (e) {

                await downloadImage(url);
                await s3.upload({
                    Key: hash + '.png',
                    Body: require('fs').readFileSync(__dirname + '/avatar.png'),
                    Bucket: '3speak-profile-temp',
                    ACL: 'public-read',
                    ContentType: 'image/png'
                }).promise();

                // console.log("Saved avatar for:", req.query.username)
                res.status(200).end();

}

} else {

            // console.log("No avatar found for:",req.query.username)
            res.status(200).end();

}

}
}
