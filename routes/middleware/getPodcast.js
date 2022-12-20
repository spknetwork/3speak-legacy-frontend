const {mongo} = require('../../helper');

module.exports = async(req, res, next) => {

    if (req.query.v && req.query.v.indexOf('/') > -1) {

        const podcast = await mongo.Podcast.findOne({
            owner: req.query.v.split('/')[0],
            permlink: req.query.v.split('/')[1],
            status: 'published'
        })
          // .cache(60 * 10);


        const creatorBanned = await mongo.ContentCreator.findOne({
            username: req.query.v.split('/')[0],
            banned: true
        });


        if (creatorBanned !== null) {

            return res.status(404).render('error/404')

        }

        req.podcast = podcast;

    } else {

        req.podcast = null;

    }

    next();

};
