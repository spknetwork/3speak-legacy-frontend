require('../page_conf')
const mongo = require('./../helper/mongo');
const hive = require('@hiveio/hive-js');
const helper = require('./helper');

// steem.api.setOptions({
//     url: 'https://anyx.io'
// });


function normaliseTags(tags) {

    tags = tags.split(',');

    const cleanedTags = [];

    for (const i in tags) {

        let tag = tags[i];
        tag = tag.toLowerCase();
        tag = tag.replace(/[^a-z]/gi, '')
        if (!cleanedTags.includes(tag) && tag.length > 0) {

            cleanedTags.push(tag)

}

}

    return cleanedTags

}

function chunk(arr, chunkSize) {

    var R = [];
    for (var i=0,len=arr.length; i<len; i+=chunkSize) {

R.push(arr.slice(i,i+chunkSize));

}
    return R;

}

(async() => {

    const feeds = await mongo.Video.find({
        status: 'published'
    }, null, {limit: 50}).sort('-score');

    const feedFinal = [];

    for (const i in feeds) {

        const v = feeds[i]
        feedFinal.push({
            trending_position: parseInt(i) + 1,
            created: v.created,
            language: v.language || 'en',
            views: v.views || 0,
            author: v.owner,
            permlink: v.permlink,
            title: v.title,
            duration: v.duration,
            tags: normaliseTags(v.tags),
            images: {
                thumbnail: 'https://media.3speak.tv/' + v.permlink + '/thumbnail.png',
                poster: 'https://media.3speak.tv/' + v.permlink + '/poster.png',
                post: 'https://media.3speak.tv/' + v.permlink + '/post.png'
            }
        })

}

    const chunks = chunk(feedFinal, 10)


    const operations = [];

    for(const i in chunks) {

        operations.push([
                'custom_json', {
                required_posting_auths: ['threespeak'],
                required_auths: [],
                id: '3speak-trending-'+i,
                json: JSON.stringify(chunks[i])
            }
            ])

}

    try {

        const tx = await hive.broadcast.sendAsync({
            operations: operations
        }, {posting: helper.config.steem.account.threespeak.wif});
        console.log('DONE: https://steemd.com/tx/' + tx.id)
        process.exit(0)

} catch (e) {

        console.log(e.message)
        process.exit(0)

    }

})()
