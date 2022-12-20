const {mongo} = require('../../helper');
const m3u8 = require('m3u8');


async function getM3u8(owner, permlink, start = 0) {

    const playlist = await mongo.Playlist.findOne({owner, permlink});
    const playlistData = m3u8.M3U.create();

    const items = await mongo.PlaylistItem.find({
        playlist: playlist._id,
        position: {$gt: start}
    });

    for (const i in items) {

        const v = await mongo.Video.findOne({permlink: items[i].permlink})
        playlistData.addPlaylistItem({
            duration: v.duration,
            title: v.title,
            uri: APP_VIDEO_CDN_DOMAIN +'/' + items[i].permlink + '/default.m3u8'
        });

}


    return playlistData.toString()

}

module.exports = {
    getM3u8
}
