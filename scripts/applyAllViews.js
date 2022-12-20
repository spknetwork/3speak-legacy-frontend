require('../page_conf')
const mongo = require('./../helper/mongo');

async function countViews(author, permlink) {

    const count = await mongo.View.countDocuments({author: author, permlink: permlink});
    return count;

}

async function main(res) {

    for (let i = 0; i < res.length; i++) {

        const video = res[i];
        const viewCount = await countViews(video.owner, video.permlink);
        video.views = viewCount;
        console.log(viewCount);
        video.save().then(function() {

            if (i === res.length-1) {

                process.exit(0);

}

});

}

}

mongo.Video.find({status: 'published'}, function(err, res) {

    main(res)

});
