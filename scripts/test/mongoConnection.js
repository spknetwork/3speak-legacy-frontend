require('../../page_conf')
const mongoose = require('mongoose');
const server = 'mongodb://localhost:27018'
const database = 'threespeak';

const mongooseCache = require('mongoose-redis');
mongooseCache(mongoose, APP_REDIS_HOST)

mongoose.connect(`${server}/${database}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(async() => {
  console.log('Successfully connect to MongoDB.');
  const VideoSchema = new mongoose.Schema({
    filename: {type: String, required: true},
    skynet: String,
    originalFilename: {type: String, required: true},
    thumbnail: String,
    score: {type: Number, required: true, default: 0},
    title: String,
    tags: String,
    description: String,
    lowRc: {type: Boolean, default: false, required: true},
    status: {
      type: String,
      enum: ['uploaded', 'encoding', 'saving', 'published', 'deleted', 'encoding_failed', 'encoding_queued', 'encoding_halted_time', 'encoding_queued_vod', 'scheduled'],
      default: 'uploaded',
      required: true
    },
    raw_description: String,
    size: {type: Number, required: true},
    permlink: {type: String, required: true},
    duration: {type: Number, required: false},
    isVOD: {type: Boolean, required: true, default: false},
    created: {type: Date, required: true, default: Date.now()},
    published: Date,
    pipeline: String,
    owner: {type: String, required: true},
    isB2: {type: Boolean, required: true, default: false},
    pinned: {type: Boolean, required: true, default: false},
    b2Permlink: {type: String},
    is3CJContent: {type: Boolean, required: false, default: false},
    isNsfwContent: {type: Boolean, required: true, default: false},
    language: {type: String, required: false, default: 'en'},
    category: {type: String, required: false, default: 'general'},
    firstUpload: {type: Boolean, default: false},
    hive: {type: String, default: 'hive-181335'},
    showDownload: {type: Boolean},
    encoding_price_steem: {type: String, required: true, default: '0.000'},
    paid: {type: Boolean, default: false, required: true}, //only ever true when there was a manual payment!
    indexed: {type: Boolean, default: false},
    views: {type: Number, default: 0},
    recommended: {type: Boolean, default: false},
    curationComplete: {type: Boolean, default: false},
    upvoteEligible: {type: Boolean, default: true},
    app: String,
    badges: {
      type: [String],
      default: []
    },
    hasTorrent: {type: Boolean, required: true, default: false},
    receipt: String,
    publish_type: {type: String, default: 'publish', enum: ['publish', 'schedule'], required: true},
    publish_data: {type: Date},
    declineRewards: {type: Boolean, default: false},
    rewardPowerup: {type: Boolean, default: false},
    publishFailed: {type: Boolean, default: false, required: true},
    steemPosted: Boolean,
    beneficiaries: {type: String, default: '[]'},
    score_boost: Number,
    ipfs: String,
    needsHiveUpdate: Boolean,
    hasAudioOnlyVersion: {
      type: Boolean,
      required: true,
      default: false
    }
  });
  const Video = mongoose.model('Video', VideoSchema);
  let vid = await Video.findOne({permlink: 'mcjyiqtq'})
  console.log(vid)
})
  .catch(err => {
    console.error('Connection error', err);
    process.exit();
  })
