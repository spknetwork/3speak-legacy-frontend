require('../page_conf')
const mongo = require("./mongo");
const hive = require("@hiveio/hive-js");
const helper = require("./helper/index")

async function claim(account) {
  try {
    let response = await hive.api.getAccountsAsync([account])
    const reward_sbd = response[0]['reward_sbd_balance']; // will be claimed as Steem Dollars (SBD)
    const reward_steem = response[0]['reward_steem_balance']; // this parameter is always '0.000 STEEM'
    const reward_vests = response[0]['reward_vesting_balance']; // this is the actual VESTS that will be claimed as SP
    let claimRES = await hive.broadcast.claimRewardBalanceAsync(THREESPEAK_POSTING_WIF, account, reward_steem, reward_sbd, reward_vests)
    console.table({
      account,
      reward_sbd,
      reward_steem,
      reward_vests,
      result: claimRES.id
    })
  } catch (e) {
    console.error("FAILED: " + account, e.message)
  }
}

mongo.ContentCreator.find({banned: false, hidden: false}).then(async creators => {

  creators = creators.concat([
    "threespeakwallet",
    "threespeakex",
    "threespeak.com0",
    "threespeak.com1",
    "threespeak.com2",
    "threespeak.com3",
    "threespeak.com4",
    "threespeak.com5"
  ]);

  for (let i in creators) {
    const creator = creators[i];
    if (typeof creator === "object") {
      await claim(creator.username)
    } else {
      await claim(creator);
    }

  }


  process.exit(0)
});
