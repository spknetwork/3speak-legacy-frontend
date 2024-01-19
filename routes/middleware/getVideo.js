const {mongo} = require('../../helper')

module.exports = async(req, res, next) => {

    if (req.query.v && req.query.v.indexOf('/') > -1) {

        let video = await mongo.Video.findOne({
            owner: req.query.v.split('/')[0],
            permlink: req.query.v.split('/')[1],
            status: 'published'
        });


        if (video === null) {

            const playlist = await mongo.Playlist.findOne({
                owner: req.query.v.split('/')[0],
                permlink: req.query.v.split('/')[1]
            });

            if (playlist !== null) {

               
                const index = (!isNaN(parseInt(req.query.i)) ? parseInt(req.query.i) : 1) - 1;
                const pli = playlist.list[index]
                

                if (pli !== null) {

                    video = await mongo.Video.findOne({permlink: pli.permlink})
                    let next = null;
                    const totalItems = playlist.list.length

                    if (index < totalItems) {

                        const pli = playlist.list[index + 1]
                        if(pli) {
                            next = await mongo.Video.findOne({
                                permlink: pli.permlink
                            })
                            next.index = index + 2
                        }
                    }
                    video.playlist = {
                        owner: playlist.owner,
                        id: playlist.permlink,
                        current: index,
                        next
                    }
                    console.log(video.playlist)
                }

            }

        }

        const creatorBanned = await mongo.ContentCreator.findOne({
            username: req.query.v.split('/')[0],
            banned: true
        });


        if (creatorBanned !== null) {

            return res.status(404).render('error/404')

        }

        req.video = video;

    } else {

        req.video = null;

    }

    next();

};
