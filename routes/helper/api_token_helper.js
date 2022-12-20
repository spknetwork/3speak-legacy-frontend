const { config } = require("../../config/index.js");
const jwt = require('jsonwebtoken');
const {mongo} = require('../../helper');
//const secret = require('fs').readFileSync(__dirname + '/jwt.key').toString();
const secret = config.jwtKey;

function sign(data) {

    return jwt.sign(data, secret, {expiresIn: '10y'});

}

async function tokenExist(token) {

    return await mongo.UploadAPIToken.countDocuments({token}) === 1

}

async function verify(token) {

    if (!await tokenExist(token)) {

        return null

}
    try {

        return jwt.verify(token, secret);

} catch (err) {

        return null

}

}

async function createOauthToken(app, user, scopes) {

    const token = sign({
        app: app.app_id,
        user: {
            username: user.nickname
        },
        scopes
    });

    await storeToken(token, app.app_id, user.nickname)

    return token

}

async function storeToken(token, app, username) {

    await (new mongo.UploadAPIToken({token, app, username})).save()

}


module.exports = {createOauthToken, verify}
