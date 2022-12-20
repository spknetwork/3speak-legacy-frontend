const {mongo} = require('../../helper');

module.exports = async(req, res, next) => {

    if (req.query.channel) {

        req.channel = await mongo.ContentCreator.findOne({
            username: req.query.channel,
            banned: false
        });

} else {

        req.channel = null;

    }

    next();

};
