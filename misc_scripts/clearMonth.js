const now = new Date();

require('../page_conf')
const mongo = require('../helper/mongo');


void (async() => {


    var d = new Date();

    d.setMonth(d.getMonth() - 1);
    const videos = await mongo.Video.find({
        status: {$in: ['deleted', 'encoding_failed', 'uploaded']}
    }, {}, {
        sort: {
            created: -1
        }
    });
    
    console.log(videos.length)
    let totalSize = 0;
    for(let info of videos) {
        totalSize = info.size + info.size;
    }
    console.log(totalSize)
    /*const del = await mongo.Video.updateMany({
        status: 'encoding_queued',
        created: { $lt: d }
    }, {
        $set: {
            status: 'deleted'
        }
    });
    console.log(del)*/
    
})();
