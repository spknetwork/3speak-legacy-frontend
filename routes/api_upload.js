var express = require('express');
var router = express.Router();
const mongo = require('../mongo');
const md5 = require('md5');
const util = require('util')
const multer = require('multer');
const base64 = require('js-base64').Base64;
base64.extendString();
const fs = require('fs');
const tokenHelper = require('./helper/api_token_helper')

const randomstring = require('randomstring');

if (!fs.existsSync(__dirname + '/../upload')) {

  fs.mkdirSync(__dirname + '/../upload');

}

async function validateAppAccessToChannelV2(body, app, scopes) {

  const {for_channel = null} = body;

  const channel = await mongo.ContentCreator.findOne({
    username: for_channel
  });

  if (channel === null) {

    return {
      error: 'channel %s does not exist',
      params: [
        for_channel
      ],
      parsed: util.format('channel %s does not exist', for_channel)
    }

  }

  for (const i in channel.authorized_apps) {

    const d = channel.authorized_apps[i];

    if (d.app_id === app.app_id) {

      let scopesValid = true;
      const missingScopes = [];

      for (const k in scopes) {

        if (!d.scopes.includes(scopes[k])) {

          scopesValid = false;
          missingScopes.push(scopes[k])

        }

      }

      if (scopesValid === true) {

        return channel

      }

      return {
        error: 'channel %s has not authorized %s to use the scopes %s',
        params: [
          for_channel,
          app.app_id,
          missingScopes.join(',')
        ],
        parsed: util.format('channel %s has not authorized %s to use the scopes %s', for_channel, app.app_id, missingScopes.join(','))

      }

    }

  }

  return {
    error: 'channel %s has not authorized %s yet',
    params: [
      for_channel,
      app.app_id
    ],
    parsed: util.format('channel %s has not authorized %s yet', for_channel, app.app_id)
  }

}

const upload = multer({
  fileFilter: async(req, file, cb) => {

    const token = await tokenHelper.verify(req.headers.authorization);
    if (token === null) {

      return cb(new Error('invalid_token'), false)

    }
    const app = await mongo.UploadAPIPartner.findOne({app_id: token.app})
    const channel = await validateAppAccessToChannelV2(req.body, app, ['upload']);
    const {title = null, description = null, tags = null} = req.body;

    if (typeof title !== 'string' || title.length < 10 || title.length > 126) {

      cb(new Error('invalid title'))

    }
    if (typeof description !== 'string' || description.length < 10 || description.length > 1024 * 25) {

      cb(new Error('invalid description'))

    }

    const valid = !channel.error && file.mimetype === (file.fieldname === 'video' ? 'video/mp4' : 'image/png')

    let e;

    if (channel.error) {

      e = channel.parsed

    }

    if (file.mimetype !== (file.fieldname === 'video' ? 'video/mp4' : 'image/png')) {

      e = util.format('invalid mimetype for field %s. Expected %s got %s', file.fieldname, (file.fieldname === 'video' ? 'video/mp4' : 'image/png'), file.mimetype)

    }

    cb(valid === true ? null : new Error(e), valid)

  },
  storage: multer.diskStorage({
    destination: function(req, file, cb) {

      cb(null, __dirname + '/../upload')

    },
    filename: async(req, file, cb) => {

      const token = await tokenHelper.verify(req.headers.authorization);
      if (token === null) {

        cb(new Error('invalid_token'), false)

      }
      const app = await mongo.UploadAPIPartner.findOne({app_id: token.app})

      if (app === null) {

        return cb((new Error('invalid_token')))

      }

      let filename = app.app_id + '_' + md5(file.originalname + Date.now());
      filename += file.fieldname === 'video' ? '.mp4' : '.png';

      cb(null, filename)

    }
  })
});

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

router.post('/prepare', upload.fields([{name: 'video', maxCount: 1}, {
  name: 'thumbnail',
  maxCount: 1
}]), async(req, res) => {

  if (!req.files.video || !req.files.thumbnail) {

    return res.status(400).json({
      error: 'missing video or thumbnail'
    })

  }

  let {title, for_channel, description, tags = '', duration = 0} = req.body
  const token = await tokenHelper.verify(req.headers.authorization);
  const app = await mongo.UploadAPIPartner.findOne({app_id: token.app})
  if (tags.length > 0) {

    tags = normaliseTags(tags)
    if (tags.length === 0) {

      tags = ['general']

    }

  } else {

    tags = ['general']

  }

  if (isNaN(parseFloat(duration))) {

    duration = 0;

  } else {

    duration = parseFloat(duration)

  }


  const video = new mongo.UploadAPIVideo({
    file_local: req.files.video[0].filename,
    thumbnail_local: req.files.thumbnail[0].filename,
    size: req.files.video[0].size,
    duration: duration,
    app: app.app_id,
    title,
    description,
    tags,
    for_channel
  });

  await video.save();
  res.json(video)

});


module.exports = router;
