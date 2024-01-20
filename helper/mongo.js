let mongoose = require('mongoose');
const mongooseCache = require('mongoose-redis');
const cachegoose = require('recachegoose');

console.log(process.env.ENV)
if(process.env.ENV !== "dev") {
  mongooseCache(mongoose, APP_REDIS_HOST)
} else {
cachegoose(mongoose, {
  engine: 'memory'
});
}

const host = APP_MONGO_HOST;


const connection = mongoose.connect('mongodb://' + host, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const HiveCommunitySchema = new mongoose.Schema({
  name: String,
  title: String,
  sum_pending: Number,
  num_authors: Number,
  subscribers: Number,
  used: Boolean
})
const ContentCategorySchema = new mongoose.Schema({
  code: {type: String, required: true},
  display: {type: String, required: true},
  videoOnly: {type: Boolean, default: false}
});
const CategoryRequestSchema = new mongoose.Schema({
  username: {type: String, default: null},
  categoryReq: {type: String, required: true}
});
const ContentCreatorSchema = new mongoose.Schema({
  username: {type: String, required: true},
  banned: {type: Boolean, required: true, default: false},
  livestreamEnabled: {type: Boolean, required: true, default: false},
  banReason: String,
  canUpload: {type: Boolean, required: true, default: true},
  canProxyUpvote: {type: Boolean, required: true, default: false},
  queuedCanProxyUpvote: {type: Boolean, required: true, default: false},
  upvoteDay: {type: Number},
  queuedUpvoteDay: {type: Number},
  postWarning: {type: Boolean, default: false},
  isCitizenJournalist: {type: Boolean, required: false, default: false},
  limit: {type: Number, required: false, default: 0},
  queuedLimit: {type: Number, required: false, default: 0},
  hidden: {type: Boolean, required: true, default: false},
  verified: {type: Boolean, required: true, default: false},
  canSubscribed: {type: Boolean, required: true, default: false},
  joined: {type: Date, required: true, default: Date.now()},
  score: {type: Number, required: true, default: 0},
  badges: {
    type: [String],
    required: true,
    default: []
  },
  authorized_apps: {
    type: [Object],
    required: true,
    default: []
  },
  profile_image: {
    type: String,
    required: true,
    default: 'default-user.png'
  },
  awaitingVerification: {type: Boolean, default: false},
  verificationEvidence: {type: String, default: null},
  verificationRequired: {type: Boolean, default: false},
  verificationRequiredDate: {type: Date, default: null},
  warningPending: {type: Boolean, default: false},
  warningText: {type: String, default: null},
  upvoteEligible: {type: Boolean, required: true, default: true},
  strikes: {type: Array, required: true, default: []},
  darkMode:{type: Boolean, required: true, default: false},
  hasProStreaming: {type: Boolean, required: true, default: false},
  reducedUpvote: {type: Boolean, default: false}
});
const DonationSchema = new mongoose.Schema({
  username: {type: String},
  address: {type: String},
  ticker: {type: String}
})
const DonationAccountTypesSchema = new mongoose.Schema({
  ticker: {type: String},
  img: {type: String}
})
const CreatorVoteSchema = new mongoose.Schema({
  username: {type: String, required: true},
  author: {type: String, required: true},
  permlink: {type: String, required: true},
  dollars: {type: Number, required: true, default: 0},
  created: {type: Date, required: true, default: Date.now()}
});
const ViewSchema = new mongoose.Schema({
  author: {type: String, required: true},
  permlink: {type: String, required: true},
  userIP: {type: String, required: true},
  userAgent: {type: String},
  timestamp: {type: Date, required: true, default: new Date()}
});
const SubscriptionSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  channel: {type: String, required: true},
  followed_since: {type: Date, required: true, default: Date.now()},
  notifications: {type: Boolean, required: true, default: true}
});
const LiveViewSchema = new mongoose.Schema({
  channel: {type: String, required: true},
  userIP: {type: String, required: true},
  userAgent: {type: String},
  timestamp: {type: Date, required: true, default: new Date()}
});
const NotificationSchema = new mongoose.Schema({
  userId: {type: String},
  acknowledged: {type: Boolean, required: true, default: false},
  type: {
    type: String, enum: [
      'video_uploaded',
      'new_comment',
      'new_like',
      'new_subscribe',
      'donation'
    ], required: true
  },
  created: {type: Date, required: true, default: Date.now()},
  metadata: {type: Object},
  channel: {type: String}
});
const HistorySchema = new mongoose.Schema({
  userId: {type: String, required: true},
  video: {type: Object, required: true},
  author: {type: String, required: true},
  permlink: {type: String, required: true},
  watchCount: {type: Number, required: true, default: 1},
  lastWatched: {type: Date, required: true, default: Date.now()}
});
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
    enum: ['uploaded', 'encoding', 'saving', 'published', 'deleted', 'encoding_failed', 'encoding_queued', 'encoding_halted_time', 'encoding_queued_vod', 'scheduled', 'encoding_ipfs', 'publish_manual'],
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
  },
  reducedUpvote: {type: Boolean, default: false},
  donations: {type: Boolean, default: false},
  postToHiveBlog: {type: Boolean, default: false},
  tags_v2: [String],
  upload_type: {type: String},
  job_id: {type: String},
  video_v2: {type: String},
  podcast_transfered: {type: Boolean},
  fromMobile: {type: Boolean, default: false},
  isReel: {type: Boolean, default: false},
  app: {type: String},
  width: {type: Number, default: null, required: false},     
  height: {type: Number, default: null, required: false},
  isAudio: {type: Boolean, default: false},
});
const PodcastSchema = new mongoose.Schema({
  filename: {type: String, required: true},
  thumbnail: String,
  score: {type: Number, required: true, default: 0},
  title: String,
  tags: [String],
  description: String,
  status: {
    type: String,
    enum: ['uploaded', 'encoding', 'saving', 'published', 'deleted', 'encoding_failed', 'encoding_queued', 'encoding_halted_time', 'encoding_queued_vod'],
    default: 'uploaded',
    required: true
  },
  size: {type: Number, required: true},
  permlink: {type: String, required: true},
  duration: {type: Number, required: false},
  created: {type: Date, required: true, default: Date.now()},
  owner: {type: String, required: true},
  pinned: {type: Boolean, required: true, default: false},
  isNsfwContent: {type: Boolean, default: false},
  language: {type: String, required: false, default: 'en'},
  category: {type: String, required: false, default: 'general'},
  hive: {type: String, default: 'hive-181335'},
  indexed: {type: Boolean, default: false},
  views: {type: Number, default: 0},
  upvoteEligible: {type: Boolean, default: true},
  app: {type: String, required: true, default: 'threespeak'},
  hasTorrent: {type: Boolean, required: true, default: false},
  receipt: String
});

const LanguageSchema = new mongoose.Schema({
  code: {type: String, required: true},
  language: {type: String, required: true}
});
const LanguageSettingSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  languages: {
    type: [String],
    required: true,
    default: ['en', 'de', 'fr', 'es', 'nl', 'ko', 'ru', 'hu', 'ro', 'cs', 'pl', 'in', 'bn']
  }
});
const LikeSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  permlink: {type: String, required: true},
  author: {type: String, required: true},
  created: {type: Date, required: true, default: Date.now()}
});
// const UserSchema = new mongoose.Schema({
//   displayName: {type: String},
//   id: {type: String},
//   user_id: {type: String},
//   picture: {type: String},
//   nickname: {type: String},
//   type: {type: String}
// });
const TokenSchema = new mongoose.Schema({
  userId: {type: String, required: true, unique: true},
  access_token: String,
  refresh_token: String,
  expires: Date,
  username: String
});
const BlogSchema = new mongoose.Schema({
  channel: {type: String, required: true},
  permlink: String,
  status: {
    type: String,
    enum: ['draft', 'published', 'deleted'],
    required: true,
    default: 'draft'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'social',
      'announcement',
      'general',
      'gaming',
      'politics',
      'other'
    ],
    required: true,
    default: 'general'
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  thumbnail: {
    type: String,
    required: true,
    default: null
  }
});
const EmailNotificationSchema = new mongoose.Schema({
  userId: {
    type: String, require: true, unique: true
  },
  channels: [{type: mongoose.ObjectId, required: true, ref: 'ContentCreator'}],
  email: {
    type: String
  },
  allDisabled: {
    type: Boolean, required: true, default: false
  },
  verified: {
    type: Boolean, required: true, default: false
  },
  verificationString: {
    type: String, required: true
  },
  verifiedAt: Date,
  verifiedIP: String
});
const LiveStreamSchema = new mongoose.Schema({
  channel: {type: String, required: true, unique: true},
  streamkey: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  tier: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    default: 1
  },
  is247: {type: Boolean, required: true, default: false}
});
const BalanceSchema = new mongoose.Schema({
  userId: {type: String, required: true, unique: true},
  balance: {type: Number, required: true, default: 0},
  created: Date
});
const SpeakOrderSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  forwarded: {type: Boolean, required: true, default: false},
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: [
      'pending', //waiting for payment
      'paid', //payment but not credited
      'settled', //payment and credited
      'canceled' //payment canceled. not available to users.
    ]
  },
  txid: String,
  transferId: {
    type: mongoose.Types.ObjectId
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['STEEM', 'SBD'],
    default: 'STEEM'
  },
  memo: {
    type: String,
    required: true,
    unique: true
  }
});
const TransactionSchema = new mongoose.Schema({
  from: {type: String, required: true},
  to: {type: String, required: true},
  permlink: String,
  amount: {type: Number, required: true, default: 0},
  memo: String,
  timestamp: {
    type: Date, required: true, default: new Date
  },
  type: {
    type: String,
    enum: ['issue', 'transfer', 'credit'],
    required: true
  }
});
const ProxyAccountSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  canHaveNewUsers: {type: Boolean, required: true, default: true},
  paidOut: {type: Boolean, required: true, default: false} //if true means the user bough a steem account and the pending balance was transfered -- OBSOLETE as we not use 1 proxy for 1 user.
});
const ProxyUserSchema = new mongoose.Schema({
  userId: {type: String, required: true, unique: true},
  proxy: {type: String, required: true},
  pendingPayout: {type: Number, required: true, default: 0},
  banned: {type: Boolean, required: true, default: false}
});
const ProxyCommentSchema = new mongoose.Schema({
  proxy: {type: String, required: true},
  userId: {type: String, required: true},
  permlink: {type: String, required: true, unique: true},
  txid: {type: String, required: true, unique: true},
  payout: {type: Number, required: true, default: 0},
  payoutSBD: {type: Number, required: true, default: 0},
  paidOut: {type: Boolean, required: true, default: false}
});
const SessionSchema = new mongoose.Schema({
  expires: {type: Date},
  session: {type: String}
});
const UploadAPIPartnerSchema = new mongoose.Schema({
  app_id: {type: String, required: true, unique: true},
  app_secret: {type: String, required: true, unique: true},
  contact: {type: String, required: true},
  created: {type: Date, required: true, default: Date.now()},
  redirect_uris: [String],
  name: String,
  tos: String,
  privacy_policy: String,
  homepage: String
});
const UploadAPIVideoSchema = new mongoose.Schema({
  file_local: {type: String, required: true},
  thumbnail_local: {type: String, required: true},
  for_channel: {type: String, required: true},
  app: {type: String, required: true},
  title: String,
  created: {type: Date, required: true, default: Date.now()},
  duration: {type: Number, required: true, default: 0},
  size: {type: Number, required: true, default: 0},
  description: String,
  tags: [String],
  status: {
    type: String,
    enum: ['uploaded', 'processed', 'failed'],
    default: 'uploaded',
    required: true
  }
});
const UploadAPITokenSchema = new mongoose.Schema({
  token: String,
  username: String,
  app: String
});
const InterestSchema = new mongoose.Schema({
  tag: String,
  month: Number,
  year: Number,
  count: Number
});
const PlaylistSchema = new mongoose.Schema({
  owner: String,
  permlink: String,
  /*type: {type: String, required: true, enum: ['user', 'creator']},
  title: String,
  visibility: {type: String, required: true, enum: ['public', 'unlisted', 'private']},
  protected: Boolean,
  tags: [String],
  version: {
    type: String,
    required: true,
    enum: ['regular', 'web3']
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  modified_at: {
    type: Date,
    required: false,
    default: Date.now()
  }*/
  title: String,
  tags: [String],
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  modified_at: {
    type: Date,
    required: false,
    default: Date.now()
  },
  list: [{
    owner: String,
    permlink: String,
    added_at: {
      type: Date,
      required: false,
      default: Date.now()
    }
  }]
});
const PlaylistItemSchema = new mongoose.Schema({
  playlist: [{type: mongoose.ObjectId, required: true, ref: 'Playlist'}],
  permlink: String,
  position: Number
});
const InboxVerificationSchema = new mongoose.Schema({
  spkUser: {type: String},
  username: {type: String},
  verifyId: {type: String},
  platform: {type: String},
  sent: {type: Boolean, required: true, default: false}
});
const UserSchema = {
  user_id: {type: String, required: true, unique: true},
  banned: {type: Boolean, required: true, default: false},
  email: {type: String, required: true, unique: true},
  last_identity: mongoose.ObjectId,
  display_name: String //fallback for non blockchain user
}

const HiveAccountSchema = {
  account: {type: String, required: true},
  user_id: {type: mongoose.ObjectId, required: true}
}
const HiveAccountChallengeSchema = {
  account: {type: String, required: true},
  user_id: {type: String, required: true},
  challenge: {type: String, required: true, unique: true},
  key: {type: String, required: true, default: 'posting', enum: ['posting', 'active']}
}
const PollSchema = {
  pollId: {type: String},
  communityId: {type: String},
  owner: {type: String},
  question: {type: String},
  answers: {type: [String]},
  description: {type: String},
  expires: {type: Date}
};
const PollVoteSchema = {
  pollId: {type: String},
  voter: {type: String},
  answer: {type: String}
};
const ProductSchema = new mongoose.Schema({
  name: {type: String},
  description: String,
  price_usd: Number,
  currencies: [String],
  published: {type: Boolean, required: true, default: false}
});
const VideoBoostSchema = new mongoose.Schema({
  user_id: {type: String},
  permlink: String,
  order_id: {type: mongoose.ObjectId},
  boost: Number
});
const ChannelSubscriptionSchema = new mongoose.Schema({
  user_id: {type: String},
  channel: String,
  order_id: {type: mongoose.ObjectId},
  ends_at: Date
});
const OrderSchema = new mongoose.Schema({
  user_id: String,
  created_at: Date,
  paid_at: Date,
  canceled_at: Date,
  json_metadata: String,
  products: [{
    name: String,
    description: String,
    price_usd: Number,
    price_currency: Number,
    fee_percent: Number,
    quantity: Number
  }],
  currency: String,
  payment_tx_id: {type: String, default: ''},
  status: {type: String, enum: ['pending', 'tx_found', 'paid','fulfilled', 'canceled'], default: 'pending'}
})
const ChunkJobSchema = new mongoose.Schema({
  job_id: {type: String},
  permlink: {type: String}
})
const PodcastSettingsSchema = new mongoose.Schema({
  podcast_title: String,
  podcast_owner: String,
  podcast_description: String,
  podcast_image: String,
  podcast_categories: Array,
  podcast_languages: Array
});
const PodcastSettings = mongoose.model('Podcasts', PodcastSettingsSchema)
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema)
const VideoBoost = mongoose.model('VideoBoost', VideoBoostSchema)
const ChannelSubscription = mongoose.model('ChannelSubscription', ChannelSubscriptionSchema)
const HiveAccountChallenge = mongoose.model('HiveAccountChallenge', HiveAccountChallengeSchema);
const HiveAccount = mongoose.model('HiveAccount', HiveAccountSchema);
const User = mongoose.model('User', UserSchema);
const Interest = mongoose.model('Interest', InterestSchema);
const HiveCommunity = mongoose.model('HiveCommunity', HiveCommunitySchema);
const CategoryRequest = mongoose.model('CategoryRequest', CategoryRequestSchema);
const ContentCategory = mongoose.model('ContentCategory', ContentCategorySchema);
const ContentCreator = mongoose.model('ContentCreator', ContentCreatorSchema);
const CreatorVote = mongoose.model('CreatorVote', CreatorVoteSchema);
const ProxyComment = mongoose.model('ProxyComment', ProxyCommentSchema);
const ProxyAccount = mongoose.model('ProxyAccount', ProxyAccountSchema);
const ProxyUser = mongoose.model('ProxyUser', ProxyUserSchema);
const Balance = mongoose.model('Balance', BalanceSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
//const Podcast = mongoose.model('Podcast', PodcastSchema);
const EmailNotification = mongoose.model('EmailNotification', EmailNotificationSchema);
const Video = mongoose.model('Video', VideoSchema);
const View = mongoose.model('View', ViewSchema);
const LiveView = mongoose.model('LiveView', LiveViewSchema);
const Subscription = mongoose.model('Subscription', SubscriptionSchema);
const Like = mongoose.model('Like', LikeSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const History = mongoose.model('History', HistorySchema);
const Poll = mongoose.model('Poll', PollSchema);
const PollVote = mongoose.model('PollVote', PollVoteSchema);
const Token = mongoose.model('Token', TokenSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const SpeakOrder = mongoose.model('SpeakOrder', SpeakOrderSchema);
const LanguageSetting = mongoose.model('LanguageSetting', LanguageSettingSchema);
const Language = mongoose.model('Language', LanguageSchema);
const Session = mongoose.model('Session', SessionSchema);
const UploadAPIPartner = mongoose.model('UploadAPIPartner', UploadAPIPartnerSchema);
const UploadAPIVideo = mongoose.model('UploadAPIVideo', UploadAPIVideoSchema);
const UploadAPIToken = mongoose.model('UploadAPIToken', UploadAPITokenSchema);
const Playlist = mongoose.model('Playlist', PlaylistSchema);
const PlaylistItem = mongoose.model('PlaylistItem', PlaylistItemSchema);
const InboxVerification = mongoose.model('InboxVerification', InboxVerificationSchema);
const Livestream = mongoose.model('Livestream', LiveStreamSchema);
const Donation = mongoose.model('Donation', DonationSchema);
const DonationAccountTypes = mongoose.model('DonationAccountTypes', DonationAccountTypesSchema)
const ChunkJob = mongoose.model('ChunkJob', ChunkJobSchema)

async function asf(array, callback) {

  for (let index = 0; index < array.length; index++) {

    await callback(array[index], index, array);

  }

}

const Achievements = {
  achievements: [
    {
      title: 'Newcommer',
      description: 'Upload your first video',
      icon: '/trophys/video_1.png',
      has: async(channel) => {

        return (await Video.find({owner: channel}, {_id: 1})).length >= 1;

      }
    },
    {
      title: 'Influencer',
      description: 'Reach 1,000 Subscriber',
      icon: '/trophys/subscriber_1.png',
      has: async(channel) => {

        return (await Subscription.find({channel}, {_id: 1})).length >= 1000;

      }
    }
  ],
  getByChannel: async(channel) => {

    const achievements = [];

    await asf(Achievements.achievements, async achievement => {

      if (await achievement.has(channel)) {

        achievements.push(achievement)

      }

    });

    return achievements;

  }
};



async function updateBalance(user) {

  const tx = await Transaction.aggregate([
    {
      $match: {
        $or: [{
          to: user
        },
          {from: user}
        ]
      }
    },
    {
      $sort: {
        timestamp: -1
      }
    }
  ]);

  let amount = 0;

  for (const i in tx) {

    switch (tx[i].type) {

      case 'issue':
        if (user !== 'oauth2|Steemconnect|threespeak') {

          amount += parseFloat(tx[i].amount)

        }

        break;
      case 'credit':
        amount += parseFloat(tx[i].amount)
        break;
      case 'payout':
        amount -= parseFloat(tx[i].amount)
        break;
      case 'transfer':
        if (tx[i].to === user) {

          amount += parseFloat(tx[i].amount) * 0.99

        } else {

          amount -= parseFloat(tx[i].amount) * 0.99

        }
        break;

    }

  }

  const balance = await Balance.findOne({userId: user});

  if (balance === null) {

    const balance = new Balance();
    balance.userId = user;
    balance.balance = amount;
    balance.created = new Date();
    await balance.save();

  } else {

    await Balance.updateOne({userId: user}, {balance: amount});

  }

  return amount;

}

module.exports = {
  HiveCommunity,
  SpeakOrder,
  CategoryRequest,
  ContentCategory,
  ContentCreator,
  CreatorVote,
  Video,
  Subscription,
  Transaction,
  Notification,
  History,
  View,
  LiveView,
  Like,
  User,
  Balance,
  Token,
  Blog,
  Achievements,
  EmailNotification,
  ProxyUser,
  ProxyAccount,
  ProxyComment,
  //Livestreaming
  Livestream,
  LanguageSetting,
  Language,
  updateBalance,
  Session,
  UploadAPIPartner,
  UploadAPIVideo,
  UploadAPIToken,
  Interest,
  Playlist,
  PlaylistItem,
  InboxVerification,
  HiveAccount,
  HiveAccountChallenge,
  //Podcast,
  Poll,
  PollVote,
  Order,
  Product,
  VideoBoost,
  Donation,
  DonationAccountTypes,
  ChannelSubscription,
  ChunkJob,
  PodcastSettings,
  connection: async() => {

    return connection

  }
};
