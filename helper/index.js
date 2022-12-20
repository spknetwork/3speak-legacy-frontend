const { config } = require("../config/index.js");
const { binary_to_base58 } = require('base58-js')

function processFeed(videoFeed) {
  const bugFix = JSON.parse(JSON.stringify(videoFeed));
  let out = [];
  for (let video of bugFix) {
    let baseUrl;
    let playUrl;
    if(video.upload_type === 'ipfs') {
      baseUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.thumbnail.replace('ipfs://', '')}/`;
      playUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.video_v2.replace('ipfs://', '')}`;
    } else {
      playUrl = `${APP_VIDEO_CDN_DOMAIN}/${video.permlink}/default.m3u8`;
      if(video?.thumbnail?.includes('ipfs://')) {
        baseUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.thumbnail.replace('ipfs://', '')}/`;
      } else {
        /*if(video.ipfs) {
          baseUrl = binary_to_base58(Buffer.from(`${APP_BUNNY_IPFS_CDN}/ipfs/${video.ipfs}/thumbnail.png`));
        } else {
        }*/
        baseUrl = `${APP_IMAGE_CDN_DOMAIN}/${video.permlink}/thumbnails/default.png`;
      }
    }
    video.thumbUrl = `https://images.hive.blog/p/${binary_to_base58(Buffer.from(baseUrl))}?format=jpeg&mode=cover&width=340&height=191`;
    video.created = new Date(video.created)
    video.baseThumbUrl = baseUrl;
    video.playUrl = playUrl;
    out.push(video)
  }
  return out;
}

module.exports = {
  config: require('./config'),
  mongo: require('./mongo'),
  twig: require('./twig.js'),
  logger: require('./logger'),
  defaultErrorHandler: require('./defaultErrorHandler'),
  aws: require('./aws'),
  bunny: require('./bunny'),
  cognito: require('./cognito'),
  hiveHelper: require('./hive'),
  rss: require('./rss'),
  rabbit: require('./rabbit'),
  admins: [
    config.admin
  ],
  processFeed
}
