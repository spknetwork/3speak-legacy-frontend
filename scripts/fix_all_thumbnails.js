require('../page_conf');
const path = require('path');
const {mongo} = require('../helper');
const {spawn} = require('child_process');

async function execute(command, parameter = [], showOutput = false, shell = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, parameter);
    if (showOutput === true) {
      child.stdout.on('data',
        function(data) {
          // eslint-disable-next-line no-console
          console.log(data.toString());

        });
      child.stderr.on('data', function(data) {
        // eslint-disable-next-line no-console
        console.log(data.toString());

      });
    }
    child.on('exit', code => {
      resolve(code)
    });
  })
}

function wget(url, output) {
  return execute('wget', ['--progress=bar:force', url, '-O', output], true)
}

function rm(directory) {
  return execute('rm', ['-rf', directory])
}

function mkdir(directory) {
  return execute('mkdir', ['-p', '-m', '777', directory])
}

function createThumbnails(permlink) {

  function getPath(filename) {
    return path.join(__dirname, permlink, 'thumbnails', filename)
  }

  function getPresetPath(filename) {
    return path.join(__dirname, 'presets', filename)
  }

  const SIZES = {
    PRESET: [1920, 1080].join('x'),
    THUMBNAIL: [250, 141].join('x'),
    POSTER: [1280, 720].join('x'),
    POSTER_WATERMARK: [128, 128].join('x') + ['', 10, 10].join('+'),
    POST: [640, 358].join('x'),
    POST_WATERMARK: [64, 64].join('x') + ['', 10, 10].join('+'),
    POST_PLAY_WATERMARK: [128, 128].join('x') + ['', 0, 0].join('+')
  }

  const commands = [
    ['convert', ['-resize', SIZES.PRESET, getPath('default.png'), getPath('preset.png')]],
    ['convert', ['-resize', SIZES.THUMBNAIL, getPath('preset.png'), getPath('thumbnail.png')]],
    ['convert', ['-resize', SIZES.POST, getPath('preset.png'), getPath('post.png')]],
    ['convert', ['-resize', SIZES.POSTER, getPath('preset.png'), getPath('poster.png')]],

    ['composite', ['-geometry', SIZES.POST_WATERMARK, '-gravity', 'southeast', getPresetPath('watermark.png'), getPath('post.png'), getPath('post.png')]],
    ['composite', ['-geometry', SIZES.POST_PLAY_WATERMARK, '-gravity', 'center', getPresetPath('play.png'), getPath('post.png'), getPath('post.png')]],

    ['composite', ['-geometry', SIZES.POSTER_WATERMARK, '-gravity', 'southeast', getPresetPath('watermark.png'), getPath('poster.png'), getPath('poster.png')]],

    ['mv', [getPath('preset.png'), getPath('default.png')]]
  ];

  return execute('bash', ['-c', commands.map(x => x[0] + ' ' + x[1].join(' ')).join(' && ')], true)
}


function getThumbnailUrl(permlink) {
  return `${APP_VIDEO_CDN_DOMAIN}/${permlink}/thumbnails/default.png`;
}

function upload(permlink) {
  return execute('aws', ['s3', 'sync', permlink, `s3://v--03-eu-west.3speakcontent.online/${permlink}`, '--acl=public-read', '--endpoint=https://s3.eu-central-1.wasabisys.com'], true)
}

(async() => {

  const videos = await mongo.Video.find({status: 'published'}, {permlink:1});

  for (const video of videos) {

    const WORK_DIRECTORY = path.join(__dirname, video.permlink, 'thumbnails');

    await mkdir(WORK_DIRECTORY)

    await wget(getThumbnailUrl(video.permlink), path.join(WORK_DIRECTORY, 'default.png'))

    await createThumbnails(video.permlink);

    await upload(video.permlink);

    await rm(video.permlink);

    // eslint-disable-next-line no-console
    console.log('== Fixed Video:', video.permlink)

  }

})();
