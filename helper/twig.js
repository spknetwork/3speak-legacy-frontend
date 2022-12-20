const twig = require('twig');
const mongo = require('./mongo')
const moment = require('moment');
const striptags = require('striptags');
const twas = require('twas');
const numeral = require('numeral');
const hive = require('@hiveio/hive-js')
const fs = require('fs');
const path = require('path');
const HiveRenderer = require('./render')
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});


module.exports = (filePath, options, callback) => {

  twig.extendFilter('hasVoted', (value, params) => {
    return value.find( x => x.voter === params[0] && x.rshares > 0) !== undefined
  })

  twig.extendFilter('hasRSSFeed', (value) => {
    return true
  })

  twig.extendFilter('hasDownvoted', (value, params) => {
    return value.find( x => x.voter === params[0] && x.rshares < 0) !== undefined
  })

  twig.extendFilter('upvotes', (value, params) => {
    if (Array.isArray(value)) {
      try {
        return value.filter(x => x.rshares > 0)
      } catch (e) {
        return []
      }

    }
    return [];
  })

  twig.extendFilter('downvotes', (value, params) => {
    if (Array.isArray(value)) {
      try {
        return value.filter(x => x.rshares < 0)
      } catch (e) {
        return []
      }

    }
    return [];
  })


  twig.extendFilter('hiverender', value => {
    try {
      return HiveRenderer.render(value)
    } catch (e) {
      return '<div class="alert alert-danger">This content can not be viewed currently as it contains malicious links or content.</div>'
    }
  });

  twig.extendFilter('json_decode', (value, params) => {
    try {
      value = JSON.parse(value);
    } catch (e) {
      throw new twig.Error(e)
    }
    return value;
  });

  twig.extendFilter('global', (value, params) => { //TODO: Maybe replace by injecting the global variable directly into twig
    if (global[value]) {
      return global[value];
    }

    return value;
  });

  twig.extendFilter('isContentCreator', async(value) => {
    return ((await mongo.ContentCreator.findOne({username: value})) !== null)
    // return true
  });

  twig.extendFilter('showDownloadButton', value => {
    const BOOM_DATE = 1588291200000;

    return value.created.getTime() > BOOM_DATE
  })

  twig.extendFilter('menuIcon', (value, params) => {

    const darkMode = params && params[0] && params[0] === true ? 'dark_' :'';

    const icon_path = path.join(__dirname, '..', 'public','img', darkMode + value);

    if (fs.existsSync(icon_path) && value.endsWith('.svg')) {
      return  fs.readFileSync(icon_path).toString();
    }

    return '';
  })

  twig.extendFilter('striptags2', async(value) => {
    return striptags(value)
  });

  twig.extendFilter('avatar', (value) => {
    if (!value) {
return '';
}

    if (value.length > 16) {
      value = null;
    }

    return 'https://images.hive.blog/u/' + value + '/avatar';
  });

  twig.extendFilter('parseInt', (value) => {
    return parseInt(value)
  });

  twig.extendFilter('appLink', (value) => {
    return '<a target="_blank" href="' + value.homepage + '">' + value.name + '</a>';
  });

  twig.extendFilter('getApp', async(value) => {
    let app = await mongo.UploadAPIPartner.findOne({app_id: value})
    console.log(app)
    return app;
  });


  twig.extendFilter('duration', (value) => {

    try {
      value = parseFloat(value);
      let reg = /(\d\d:\d\d:\d\d)/;
      // if (value < 3600) {
      //     reg = /(\d\d:\d\d)/;
      // }

      let duration = (new Date(value * 1000)).toUTCString().match(reg)[0];
      if (duration.startsWith('00:')) {
        duration = duration.substr(3)
      }
      return duration
    } catch (e) {
      return '00:00'
    }
  });

  twig.extendFilter('ago', (value) => {
    try {
      if (typeof value === 'string') {
        value = new Date(value)
      }
      return twas(value)
    } catch (e) {
      console.log(e)
      return 'now'
    }
  });


  twig.extendFilter('video_badges', value => {
    let html = '';

    if (!Array.isArray(value)) {
      return html
    }

    if (value.includes('australia')) {
      html += `<img onclick="window.location.href = \'https://hive.blog/hive-100421/@threespeak/3speak-for-australia-raising-funds-for-wise-and-rfs\'" class="profile-badge video-badge" alt="This video supports the 3Speak fundraising campaign for WIRES and the RFS" title="This video supports the 3Speak fundraising campaign for WIRES and the RFS" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/australia_2020.png">`
    }

    if (value.includes('iglo')) {
      html += `<img onclick="alert(\'Alles klar Kinder?\')" class="profile-badge video-badge" alt="This video was uploaded by Cpt. Iglo." title="This video was uploaded by Cpt. Iglo." src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/iglo.png">`
    }

    if (value.includes('skynet')) {
      html += '<img class="profile-badge video-badge" alt="This video is hosted on SKYNET" title="This video is hosted on SKYNET" src="https://cdn.3speakcontent.online/profile/badges/skynet.png">'
    }

    return html;

  })

  twig.extendFilter('profile_badges', (value) => {
    let html = '';

    if (!Array.isArray(value)) {
      return html
    }


    if (value.includes('team')) {
      html += `<img class="profile-badge" alt="Staff Member" title="Official Core Team Member of 3Speak" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/team.png">`
    }

    if (value.includes('alpha_tester')) {
      html += `<img class="profile-badge" alt="ALPHA Tester" title="This user was a tester during the ALPHA period of 3Speak" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/alpha.png">`
    }

    if (value.includes('beta_tester')) {
      html += `<img class="profile-badge" alt="BETA Tester" title="This user was a tester during the BETA period of 3Speak" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/beta.png">`
    }

    if (value.includes('iglo')) {
      html += `<img onclick="alert(\'Ohne Zusatzstoffe! 100% natürliches Aroma!\')" class="profile-badge"  title="100% FISH FILET!" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/iglo.png">`
    }

    if (value.includes('threespeak_witness_vote')) {
      html += `<img class="profile-badge" alt="Votes for 3Speak as witness" title="Votes for 3Speak as witness" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/threespeak_witness_vote.png">`
    }

    if (value.includes('journalist')) {
      html += `<img class="profile-badge" alt="Member of the 3Speak Citizen Journalist program" title="Member of the 3Speak Citizen Journalist program" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/journalist.png">`
    }

    if (value.includes('telegram_wehmoen')) {
      html += `<img class="profile-badge" alt="This is @wehmoen from Telegram." title="This is @wehmoen from Telegram. He is the former Lead Developer of ${APP_PAGE_DOMAIN}." src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/telegram_wehmoen.png">`
    }

    if (value.includes('deutsch')) {
      html += `<img class="profile-badge" alt="German Community" title="This creator is member of the German community." src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/germany.png">`
    }

    if (value.includes('themarkymark')) {
      html += `<img class="profile-badge" alt="The one and only: themarkymark" title="The one and only: themarkymark" src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/themarkymark.png">`
    }

    if (value.includes('hot')) {
      html += `<img class="profile-badge" alt="Mr HIVE 2020" title="This creator won the 2020 Mr HIVE contest and is officially the hottest male creator on HIVE." src="${APP_VIDEO_CDN_DOMAIN}/profile/badges/fire.png">`
    }

    return html;
  });

  twig.extendFilter('logreturn', (value) => {
    console.log(value);
    return value
  });

  twig.extendFilter('counter', (value) => {
    function nFormatter(num, digits) {
      var si = [
        {value: 1, symbol: ''},
        {value: 1E3, symbol: 'k'},
        {value: 1E6, symbol: 'M'},
        {value: 1E9, symbol: 'G'},
        {value: 1E12, symbol: 'T'},
        {value: 1E15, symbol: 'P'},
        {value: 1E18, symbol: 'E'}
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }

    return nFormatter(value, 0)
  });

  twig.extendFilter('includes', (value, params) => {
    return Array.isArray(value) ? value.includes(params[0]) : false;
  });

  twig.extendFilter('substr', (value, params) => {
    try {
      let str = value.substr(params[0], params[1]);
      if (value.length > str.length) {
        str = str.trim() + '...'
      }
      return str;
    } catch (e) {
      return value;
    }
  });

  twig.extendFilter('slice', (value, params) => {
    try {
      return value.slice(params[0], params[1]);
    } catch (e) {
      return value
    }
  });

  twig.extendFilter('hhmmss', (value, params) => {
    var date = new Date(null);
    date.setSeconds(value); // specify value for SECONDS here
    let str = date.toISOString().substr(11, 8);
    if (str.startsWith('00:')) {
      return str.substr(3)
    }
    return str
  });

  twig.extendFilter('filesize', (value, params) => {
    return formatBytes(value)
  });
  twig.extendFilter('toFixed', (value, params) => {
    let decimals = params === undefined ? 0 : params[0] === undefined ? 0 : params[0];
    return value.toFixed(decimals)
  });


  twig.extendFilter('mdate', (value, params) => {
    let format = params === undefined ? 'lll' : params[0] === undefined ? 'lll' : params[0];
    return moment(value).format(format)
  });

  twig.extendFilter('spk_price', async(value, params) => {
    return spkHelper.getTotalPrice(value, 1).total
  });
  twig.extendFilter('split', (value, params) => {
    if (value !== undefined) {
      return value.split(params[0])
    }

    return ''

  });

  twig.extendFilter('startsWith', (value, params) => {
    if (value !== undefined && typeof value === 'string') {
      return value.startsWith(params[0])
    }

    return false

  });

  twig.extendFilter('filter_log', (value, params) => {
    params = params || [];
    if (params.length === 0) {
return [];
}
    let filtered = [];
    value.forEach(log => {
      if (params[0].includes(log.table)) {
        filtered.push(log);
      }
    });
    return filtered;
  });


  twig.extendFilter('shop_usd_format', async(value, params) => {
    return numeral(value).format('$0,0.00');
  })

  twig.extendFilter('shop_order_status_description', async(value, params) => {
    switch (value) {
      case 'pending':
        return 'Waiting for payment.'
      case 'tx_found':
        return 'Transaction found! Waiting for the transaction to become irreversible.'
      case 'paid':
        return 'The payment was completed. Your order will now be processed by a team member. This can take up to 24 hours. '
      case 'fulfilled':
        return 'The order was fulfilled.'
      case 'canceled':
        return 'The order was canceled.'
    }
  })
  twig.extendFilter('hiveblocks', async(value, params) => {

    const what = params && params.length === 1 ? params[0] : 'HOME'

    const BASE = 'https://hiveblocks.com'

    switch (what) {
      case 'tx':
        return BASE + '/tx/' + value;
      case 'account':
        return BASE + '/@' + value;
      default:
        return BASE;
    }
  })

  twig.extendFilter('usd_total', async(value, params) => {
    return numeral(value).format('$0,0.00');
  })

  twig.extendFilter('shop_total', async(value, params) => {

    const fees = SHOP_FEE; // fee %

    let currency = params && params.length === 1 ? params[0] : value.currency
    let total_usd = 0;
    let total_currency = 0

    for (let p of value.products) {
      total_usd += p.quantity * p.price_usd;
      total_currency += p.quantity * p.price_currency
    }
    switch (currency) {
      case 'USD':
        return numeral(total_usd).format('$0,0.00');
      case 'TOTAL':
        return numeral(total_usd * (1 + (fees / 100))).format('$0,0.00');
      case 'FEE':
        return numeral(total_usd * (fees / 100)).format('$0,0.00');
      case 'NUMBER':
        return total_usd;
      case 'HIVE':
        return numeral(total_currency).format('0,0.000') + ' HIVE';
      case 'HIVE_FEE':
        return numeral(total_currency * (fees / 100)).format('0,0.000') + ' HIVE';
      case 'HIVE_TOTAL':
        return numeral(total_currency * (1 + fees / 100)).format('0,0.000') + ' HIVE';

      case 'HBD':
        return numeral(total_currency).format('0,0.000') + ' HBD';
      case 'HBD_FEE':
        return numeral(total_currency * (fees / 100)).format('0,0.000') + ' HBD';
      case 'HBD_TOTAL':
        return numeral(total_currency * (1 + fees / 100)).format('0,0.000') + ' HBD';
      default:
        return `Unknown currency ${currency}`


    }
  })

  twig.extendFilter('subscription', async(channel, params) => {
    return '<div></div>'
    let creator = await mongo.ContentCreator.findOne({username: channel})

    if (creator === null) {
      return '';
    }

    if (params && params.length === 1) {
      let sub = await mongo.ChannelSubscription.findOne({
        channel,
        user_id: params[0],
        ends_at: {$gt: Date.now()}
      });

      if (sub !== null) {
        let sub_end = moment(sub.ends_at).format('MMMM Do YYYY hh:mma')
        return '<button class="btn btn-light btn-sm" title="Subscribed to ' + channel + ' until ' + sub_end + '"><i class="fa fa-certificate"></i> Subscribed</button>'
      }

      return '<a class="btn btn-light btn-sm" title="Subscribe to ' + channel + ' for 30 days." href="/shop/buy/5f3faf7a9a0029e790272e06/HIVE?channel=' + channel + '"><i class="fa fa-certificate"></i> Subscribe ($4.99)</a>'
    }
  })


  twig.extendFilter('getMainTransferAccount', async(order, params) => {

    if (order.json_metadata && order.json_metadata.length > 0) {
      let metadata = JSON.parse(order.json_metadata);
      if (metadata.channel) {
        return hive.utils.validateAccountName(metadata.channel) === null ? metadata.channel : 'threespeakwallet'
      }
    }

    return 'threespeakwallet'
  })


  twig.extendFilter('getSubscribedAccounts', async(channel, params) => {

    let subs = await mongo.ChannelSubscription.find({
      channel,
      ends_at: {$gt: Date.now()}
    });


    let subbed_account_names = [];

    for (let sub of subs) {
      let user = await mongo.User.findOne({user_id: sub.user_id})
      let accounts = await mongo.HiveAccount.find({user_id: user._id});
      if (accounts !== null) {
        for (let account of accounts) {
          subbed_account_names.push(account.account)
        }
      }
    }

    let subbed_account_names_unique = [];

    for (let sub of subbed_account_names) {
      if (!subbed_account_names_unique.includes(sub)) {
        subbed_account_names_unique.push(sub)
      }
    }

    return subbed_account_names_unique
  })

  return twig.renderFile(filePath, options, callback);
}
