const hive = require('@hiveio/hive-js');
const dhive = require('@hiveio/dhive')
require('../../page_conf')
hive.api.setOptions({
  useAppbaseApi: true,
  rebranded_api: true,
  url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`
});
const client = new dhive.Client('https://hive-api.web3telekom.xyz');
hive.config.set('rebranded_api','true');
hive.broadcast.updateOperations();

const PostTemplate = require('fs').readFileSync(__dirname + '/post_template.md').toString();

const delegator_name = 'threespeak';
const regHelper = require('../../helper');


async function hasDelegation(account) {
  async function loadDelegations(from = '', delegations = []) {
    let data = await hive.api.getVestingDelegationsAsync(delegator_name, from, 50);
    for (let delegatee of data) {
      delegations.push(delegatee.delegatee)
    }
    if (data.length === 50) {
      return loadDelegations(data[data.length - 1].delegatee, delegations)
    }
    return delegations;

  }

  let delegations = await loadDelegations()
  return delegations.includes(account)
}

function hasPostingAuthority(account) {
  return new Promise(function (resolve, reject) {
    hive.api.getAccounts([account], function (err, result) {
      if (
        (err === null || err === undefined) &&
        result !== null &&
        result !== undefined &&
        Array.isArray(result) &&
        result.length === 1
      ) {
        const account = result[0];
        if (Array.isArray(account.posting.account_auths)) {
          account.posting.account_auths.forEach(function (item) {
            if (item[0] === "threespeak") {
              return resolve(true);
            }
          });
        }
        return resolve(false);
      } else {
        return resolve(false);
      }
    });
  });
}

async function getHiveContentBeneficiaries(author, permlink) {
  return new Promise((resolve, reject) => {
    hive.api.getContent(author, permlink, function (err, result) {
      if (err) {
        return reject(err);
      } else if (typeof result === "string") {
        const data = JSON.parse(result);
        if (data.result !== undefined && data.result.length === 0) {
          return reject("No data found on hive chain");
        } else if (
          data.result.beneficiaries !== undefined &&
          Array.isArray(data.result.beneficiaries)
        ) {
          return resolve(data.result.beneficiaries);
        } else {
          return reject("No data found on hive chain");
        }
      } else if (result.result !== undefined && result.result.length === 0) {
        return reject("No data found on hive chain");
      } else if (
        result.beneficiaries !== undefined &&
        Array.isArray(result.beneficiaries)
      ) {
        return resolve(result.beneficiaries);
      } else {
        return reject("No data found on hive chain");
      }
    });
  });
}

async function validateBeneficiaries(video) {
  try {
    const beneficiaries = await getHiveContentBeneficiaries(video.owner, video.permlink);
    const fromMobile = video.fromMobile;
    if (fromMobile !== undefined && fromMobile !== null && fromMobile === true) {
      const sagar = beneficiaries.filter((o) =>  o.account === "sagarkothari88");
      const spkBeneficiary = beneficiaries.filter((o) => o.account === "spk.beneficiary");
      if (sagar.length === 0) return false;
      const sagarBenWeight = sagar[0].weight;
      const spkBeneficiaryWeight = spkBeneficiary[0].weight;
      if (sagarBenWeight === undefined || spkBeneficiaryWeight === undefined || sagarBenWeight === null || spkBeneficiaryWeight === null) return false;
      if (sagarBenWeight < 100 || spkBeneficiaryWeight < 1000) return false;
      return true;
    } else {
      const spkBeneficiary = beneficiaries.filter((o) => o.account === "spk.beneficiary");
      const spkBeneficiaryWeight = spkBeneficiary[0].weight;
      if (spkBeneficiaryWeight === undefined || spkBeneficiaryWeight === null) return false;
      if (spkBeneficiaryWeight < 1000) return false;
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
}

function processTags(tags) {
  const fallback = ['threespeak', 'video'];

  const processed = [];

  for (let tag of tags) {
    tag = tag.toLowerCase().trim();

    if (!tag.startsWith('hive-') && tag.length >= 3) {
      tag = tag.replace(/[^a-z0-9]/g, '')
      if (!processed.includes(tag) && tag.length >= 3) {
        processed.push(tag)
      }
    }
  }

  return processed.length === 0 ? fallback : processed;
}

function buildJSONMetadata(video) {
  let tags = ['threespeak'].concat();

  let imageUrl;
  if(video?.thumbnail?.includes('ipfs://')) {
    imageUrl = APP_BUNNY_IPFS_CDN + `/ipfs/${video.thumbnail.replace('ipfs://', '')}`
  } else {
    imageUrl = APP_IMAGE_CDN_DOMAIN + `/${video.permlink}/thumbnails/default.png`;
  }

  const sourceMap = []

  if(video.video_v2) {
    sourceMap.push({
      type: 'video',
      url: video.video_v2,
      format: "m3u8"
    })
  }

  let videoTags = video.tags;
  if (videoTags === undefined || videoTags.length === 0) {
    videoTags = ["threespeak"]
  } else {
    videoTags = videoTags.split(",")
  }

  let appName = '3speak/0.3.0';
  if (video.jsonMetaDataAppName !== null && typeof video.jsonMetaDataAppName === "string" && video.jsonMetaDataAppName.length > 0) {
    appName = jsonMetaDataAppName;
  }

  return {
    tags: processTags(videoTags),
    app: appName,
    type: '3speak/video',
    image: [
      imageUrl
    ],
    video: {
      info: {
        platform: '3speak',
        title: video.title,
        author: video.owner,
        permlink: video.permlink,
        duration: video.duration,
        filesize: video.size,
        file: video.filename,
        lang: video.language,
        firstUpload: video.firstUpload,
        ipfs: video.ipfs ? video.ipfs + '/default.m3u8' : null,
        ipfsThumbnail: video.ipfs ? video.ipfs + '/thumbnail.png' : null,
        video_v2: video.video_v2,
        sourceMap: [
          ...sourceMap,
          {
            type: 'thumbnail',
            url: video.thumbnail,
          }
        ]
      },
      content: {
        description: video.description,
        tags: processTags(videoTags)
      }
    }
  };
}

async function buildCommentOptions(video) {
  let benefactor_global = [
    [0, {beneficiaries: [{account: 'spk.beneficiary', weight: 1000}]}]
  ];
  let [account] = await hive.api.getAccountsAsync([video.owner]);
  if (account && account.json_metadata) {
    let json = JSON.parse(account.json_metadata)
    if (json.beneficiaries) {
      if (Array.isArray(json.beneficiaries)) {
        let benefactors = json.beneficiaries.filter(x => x.name !== 'spk.delegation').filter(x => x.name && x.label)
        for (let bene of benefactors) {
          switch (bene.label) {
            case 'referrer':
              benefactor_global[0][1].beneficiaries.push({
                account: bene.name,
                weight: bene.weight
              })
              break;
            case 'provider':
              benefactor_global[0][1].beneficiaries.push({
                account: bene.name,
                weight: bene.weight
              })
              break;
            case 'creator':
              benefactor_global[0][1].beneficiaries.push({
                account: bene.name,
                weight: bene.weight
              })
              break;
          }
        }
      }
    }
  }

  let videoBenefs = JSON.parse(video.beneficiaries);
  // sample value - [{"account":"actifit-he","weight":100,"src":"ENCODER_PAY"},{"account":"sagarkothari88","weight":100,"src":"MOBILE_APP_PAY"}] // MOBILE_APP_PAY_AND_ENCODER_PAY
  if (video.fromMobile === true)  {
    if (videoBenefs.filter((ben) =>  ben.account === 'sagarkothari88' && (ben.src === "MOBILE_APP_PAY" || ben.src === "MOBILE_APP_PAY_AND_ENCODER_PAY")).length === 0) {
      videoBenefs = [...videoBenefs, {account: 'sagarkothari88', weight: 100, src: 'MOBILE_APP_PAY'}];
    }
  }

  benefactor_global[0][1].beneficiaries = benefactor_global[0][1].beneficiaries.concat(videoBenefs);

  benefactor_global[0][1].beneficiaries = benefactor_global[0][1].beneficiaries.filter((bene, index) => {
    const _bene = bene.account;
    return index === benefactor_global[0][1].beneficiaries.findIndex(obj => {
      return obj.account === _bene || ['wehmoen', 'louis88', 'detlev'].includes(obj.account);
    });
  });

  console.log(benefactor_global[0][1].beneficiaries)

  return ['comment_options', {
    author: video.owner,
    permlink: video.permlink,
    max_accepted_payout: video.declineRewards === true ? '0.000 SBD' : '100000.000 SBD',
    percent_hbd: video.rewardPowerup === true ? 0 : 10000,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: video.declineRewards ? [] : benefactor_global
  }]
}

function buildPublishCustomJson(video) {
  return ['custom_json', {
    required_posting_auths: ['threespeak', video.owner],
    required_auths: [],
    id: '3speak-publish',
    json: JSON.stringify({
      author: video.owner,
      permlink: video.permlink,
      category: video.category,
      language: video.language,
      duration: video.duration,
      title: video.title
    })
  }]
}

function renderTemplate(video) {
  const [fullVideo] = regHelper.processFeed([video]);
  console.log(fullVideo)

  return PostTemplate
    .replace(/@@@thumbnail@@@/g, fullVideo.baseThumbUrl)
    .replace(/@@@author@@@/g, video.owner)
    .replace(/@@@permlink@@@/g, video.permlink)
    .replace(/@@@description@@@/g, video.description);
}

async function getOperations(video, comment_options=true) {

  hive.broadcast.updateOperations();

  const operations = [];

  operations.push([
    'comment', {
      parent_author: '',
      parent_permlink: video.hive === null || video.hive === '' || video.hive === 'hive-100421' ? 'hive-181335' : video.hive.startsWith('hive-') ? video.hive : 'hive-181335',
      author: video.owner,
      permlink: video.permlink,
      title: video.title.substr(0, 254),
      body: renderTemplate(video),
      json_metadata: JSON.stringify(buildJSONMetadata(video))
    }
  ]);

  if (comment_options) {
    operations.push(await buildCommentOptions(video))
  }
  operations.push(buildPublishCustomJson(video))

  if (video.postToHiveBlog == true) {
    operations.push([
      "custom_json",
      {
        "required_auths": [],
        "required_posting_auths": [video.owner],
        "id": "reblog",
        "json": JSON.stringify([
          "reblog", {
            "account": video.owner, 
            "author": video.owner,
            "permlink": video.permlink
          }
        ])
      }
    ])
  }


  return operations;

}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function steemPostExist(author, permlink) {
  try {
    let content = await hive.api.getContentAsync(author, permlink);

    //Apparently Hive API returns a string when post is empty and object when post exists! :shrug:
    if(typeof content === "string") {
      return JSON.parse(content).result.length !== 0;
    } else {
      //Just to be sure there is actual content
      return !!content.body
    }
  } catch (e) {
    // console.log(e)
    return false;
  }
}

async function tryPublish(operations) {
  try {
    return await hive.broadcast.sendAsync({
      operations
    }, {posting: THREESPEAK_POSTING_WIF});
  } catch (e) {
    return e;
  }
}

async function delegateHP(account, hp) {

  const delegator_wif = THREESPEAK_ACTIVE_WIF;

  const props = await client.database.getDynamicGlobalProperties();
  console.log(hp, typeof hp)
  console.log(props.total_vesting_fund_hive, typeof props.total_vesting_fund_hive)
  console.log(props.total_vesting_shares, typeof props.total_vesting_shares)
  const vestHive = parseFloat(props.total_vesting_fund_hive) / parseFloat(props.total_vesting_shares)
  function hpToVests(hp) {
    return Math.floor(hp / vestHive)
  }
  let vesting_shares = hpToVests(hp)
  vesting_shares = vesting_shares.toFixed(6)+' VESTS'
  console.log(vesting_shares)


  const privateKey = dhive.PrivateKey.fromString(delegator_wif);
  const op = [
    'delegate_vesting_shares',
    {
      delegator: delegator_name,
      delegatee: account,
      vesting_shares: vesting_shares
    }
  ];
  client.broadcast.sendOperations([op], privateKey).then(
    function(result) {
      console.log(result)
    },
    function(error) {
      console.log(error)
    }
  );
}

async function shouldSkip(video) {
  if (video.status === 'publish_manual') {
    if (video.fromMobile === true ) {
      try {
        let doWeHavePostingAuthority = await hasPostingAuthority(video.owner);
        if (doWeHavePostingAuthority === false) {
          return true;
        }
        return false;
      }  catch (err) {
        console.error(err + ' - Error while getting account info for ' + video.owner);
        return true;
      }
    } else {
      // video not posted from mobile app. do nothing for now.
      return true;
    }
  }
}

module.exports = {
  getOperations,
  sleep,
  steemPostExist,
  tryPublish,
  hasDelegation,
  delegateHP,
  hasPostingAuthority,
  shouldSkip,
  validateBeneficiaries,
}
