const HiveContentRenderer = require('hive-content-renderer');

const SECURE_HOSTS = [
  'medium.com',
  'hive.blog',
  'peakd.com',
  'wallet.hive.blog',
  'hive.io'
]

const HiveContentRendererInstance = new HiveContentRenderer({
  baseUrl: 'https://hive.blog/',
  breaks: true,
  skipSanitization: false,
  allowInsecureScriptTags: false,
  addNofollowToLinks: true,
  doNotShowImages: false,
  ipfsPrefix: '',
  assetsWidth: 640,
  assetsHeight: 480,
  imageProxyFn: (url) => url,
  usertagUrlFn: (account) => '/user/' + account,
  hashtagUrlFn: (hashtag) => '/search?q=' + hashtag,
  isLinkSafeFn: (url) => {
    if (url.startsWith('http') || url.indexOf('://') > -1) {
      try {
        url = new URL(url);
        return SECURE_HOSTS.includes(url.hostname);
      } catch (e) {
        return false;
      }
    }

    return true;
  }
}, {
  phishingWarning: 'This link is not safe!'
})

module.exports = HiveContentRendererInstance;
