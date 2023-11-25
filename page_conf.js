require('dotenv').config()

const { config } = require("./config/index.js");

global.APP_PAGE_DOMAIN = process.env.HOST || '3speak.tv';
global.APP_LIVE_DOMAIN = `live.${APP_PAGE_DOMAIN}`;
global.APP_CHAT_DOMAIN = `chat.${APP_PAGE_DOMAIN}`;
global.APP_STUDIO_DOMAIN = `studio.${APP_PAGE_DOMAIN}`;
global.APP_SIGNUP_DOMAIN = `auth.${APP_PAGE_DOMAIN}/3/signup`;
global.APP_ASSETS_DOMAIN = `assets.${APP_PAGE_DOMAIN}`;
global.APP_VIDEO_CDN_DOMAIN = 'https://threespeakvideo.b-cdn.net'
global.APP_AUDIO_CDN_DOMAIN = 'https://audio.cdn.3speakcontent.co'
global.APP_HIVE_CDN_DOMAIN = 'https://hive.cdn.3speakcontent.co'
global.APP_IMAGE_CDN_DOMAIN = 'https://media.3speak.tv'
global.APP_DESKTOP_CDN_DOMAIN = 'https://desktop.cdn.3speakcontent.co'
global.APP_BUNNY_IPFS_CDN = 'https://ipfs-3speak.b-cdn.net'

global.APP_PAGE_PROTOCOL = process.env.PROTOCOL || 'https';

global.HIVE_DEFAULT_NODE = 'hive-api.web3telekom.xyz';
global.HIVE_SECONDARY_NODE = 'hive-api.3speak.tv';
global.HIVE_DEFAULT_NODE_PREFIX = 'https';
global.HIVE_SECURE_NODE_PREFIX = 'https';
global.HIVE_CUSTOM_OPTIONS = {}

global.APP_NSFW_IMAGE = `${APP_PAGE_PROTOCOL}://${APP_PAGE_DOMAIN}/img/nsfw.png`

global.APP_SENTRY_DSN = config.appSentryDsn;

global.APP_LEADERBOARD_USERNAME_EXCLUSION_LIST = []

global.CDN_TOS_URL = `${APP_VIDEO_CDN_DOMAIN}/static/terms_of_service.pdf`;

global.SUPPORT_EMAIL = `helpdesk@${APP_PAGE_DOMAIN}`

global.APP_REDIS_HOST =  config.appRedisHost;
global.APP_MEMCACHED_HOST =  '127.0.0.1';
global.APP_MONGO_HOST = process.env.MONGO_HOST || 'localhost:27018';
global.APP_REDDITMQ_HOST = config.appRedditMqHost;

global.AUTH_API_REDIRECT_URL = process.env.ENV === 'dev' ? process.env.AUTH_API_REDIRECT_URL || 'http://localhost:9400/auth/callback' : `https://3speak.tv/auth/callback`;
global.AUTH_API_URL = `https://auth.${APP_PAGE_DOMAIN}`
global.AUTH_API_CLIENT_ID = config.authApiClientId;
// eslint-disable-next-line max-len
global.AUTH_JWT_SECRET = config.authJwtSecret;
global.AUTH_SESSION_SECRET = config.authSessionSecret;

global.AUTH_WIF_MEMO = config.authWifMemo;
global.AUTH_PUB_MEMO = config.authPubMemo;

global.AWS_ACCESS_KEY_ID = config.awsAccessKeyId;
global.AWS_SECRET_KEY = config.awsSecretKey;
global.AWS_REGION = 'eu-west-1'

global.AWS_CLOUDSEARCH_ACCESS_KEY_ID = config.awsCloudSearchAccessKeyId;
global.AWS_CLOUDSEARCH_SECRET_KEY = config.awsCloudSearchSecretKey;
global.AWS_CLOUDSEARCH_REGION = 'eu-west-1'
global.AWS_CLOUDSEARCH_ENDPOINT = config.awsCloudSearchEndpoint;
global.AWS_CLOUDSEARCH_SORT_ORDER = 'created desc'

global.WASABI_ENDPOINT = config.wasabiEndpoint;
global.WASABI_ACCESS_KEY_ID = config.wasabiAccessKeyId;
global.WASABI_SECRET_KEY = config.wasabiSecretKey
global.WASABI_REGION = 'eu-central-1';
global.WASABI_BUCKET = 'v--03-eu-west.3speakcontent.online'

global.ENCODER_SECRET = config.encoderSecret;

global.BUNNY_CDN_SECURITY_KEY = config.bunnyCdnSecurityKey;

global.SHOP_FEE = 2.5;

global.HIVESQL_HOST = config.hiveSqlHost;
global.HIVESQL_USER = config.hiveSqlUser;
global.HIVESQL_PASSWORD = config.hiveSqlPassword;
global.HIVESQL_DATABASE = config.hiveSqlDatabase;

global.THREESPEAK_POSTING_WIF = config.threespeakPostingWif;
global.THREESPEAK_ACTIVE_WIF = config.threespeakActiveWif;
global.ACCOUNT_CREATION_AUTHORITY_ACCOUNT = 'threespeak';

global.GOOGLE_RECAPTCHA_KEY = config.googleRecaptchaKey;

global.SOCIAL_TELEGRAM_LINK = 'https://t.me/threespeak?utm_source=3speak.tv';
global.SOCIAL_DISCORD_LINK = 'https://discord.gg/NSFS2VGj83';
global.SOCIAL_TWITTER_LINK = 'https://twitter.com/3speakonline?utm_source=3speak.tv';
global.SOCIAL_BLOG_LINK = 'https://hive.blog/@threespeak';
global.IOS_APP_LINK = 'https://apps.apple.com/us/app/3speak/id1614771373';
global.ANDROID_APP_LINK = 'https://play.google.com/store/apps/details?id=tv.threespeak.app';
global.ANDROID_VIA_DROPBOX = 'https://www.dropbox.com/sh/a0q5u7l3j9ygzty/AABAqtxnLrPBYbk4q5H9BBWja?dl=0';

global.RSS_FEED_WHITELIST = ['threespeak', 'brianoflondon', 'theycallmedan', 'tommyrobinson'];

process.on('unhandledRejection', () => {});
