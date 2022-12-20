require('../page_conf')
const now = new Date();

const mongo = require('./../helper/mongo');
const { Client: HiveClient, PrivateKey } = require('@hiveio/dhive')
const moment = require('moment');

const hiveClient = new HiveClient(`${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`)

const accountName = 'threespeak';
const key = PrivateKey.fromString(THREESPEAK_POSTING_WIF);

function getEffectiveVestingShares(account) {

  const effectiveVestingShares = parseFloat(account.vesting_shares) +
    parseFloat(account.received_vesting_shares) -
    parseFloat(account.delegated_vesting_shares);
  return effectiveVestingShares;

}

function calculateVotingMana(account) {

  const elapsed = moment.utc().unix() - account.voting_manabar.last_update_time;
  const maxMana = getEffectiveVestingShares(account) * 1000000;
  let currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;

  if (currentMana > maxMana) {

    currentMana = maxMana;

  }

  const currentManaPerc = currentMana / maxMana * 100;

  return currentManaPerc;

}

async function vote(index, ops) {

  const op = ops[index]
  if (op) {

    const votes = await hiveClient.database.call('get_active_votes', [op.author, op.permlink])

    // check if @threespeak has already voted
    let voted = false;
    for (let i = 0; i < votes.length; i++) {

      if (votes[i].voter === accountName) {

        voted = true;

      }

    }

    if (voted === true) {

      //don't perform another vote op, go to next as votes have already been cast
      await vote(index + 1, ops);

    } else {
      op.voter = 'threespeak';
      await hiveClient.broadcast.vote(op, key)
      await vote(index + 1, ops);

    }

  } else {

    process.exit(0);

  }

}



async function getRelativeViews(owner, permlink, views, reduced) {

  // get post data from steem
  let res = await hiveClient.database.call('get_content', [owner, permlink])

  if (!res || isNaN(res.children)) {
    res = { children: 6 }
  }

  if (reduced) {
    views *= 0.3
  }

  // if more than or equal to 5 comments, post gets full payout
  if (views < 5) {

    return 0

  } else if (res.children >= 5) {

    return views

  } else if (res.children <= 2) {

    return 0

  }  // less than 5 comments means views are essentially halved for this video


  return views / 2


}

const hoursBetween = 6;

const startPeriod = new Date(new Date().setHours(new Date().getHours() - 23))
const endPeriod = new Date(new Date().setHours(new Date().getHours() - 20))
const weekBeforeStartPeriod = new Date(new Date(startPeriod).setDate(startPeriod.getDate() - 7));

async function countVideosLastWeek(owner) {

  const videoCountLastWeek = await mongo.Video.countDocuments({
    owner: owner,
    status: 'published',
    created: { $gte: weekBeforeStartPeriod.toISOString(), $lt: startPeriod.toISOString() },
    upvoteEligible: { $ne: false }
  });
  return videoCountLastWeek;

}
(async () => {
  // get list of all users who are banned from being upvoted
  let bannedCreators = await mongo.ContentCreator.find({ upvoteEligible: false });
  let bannedCreatorsList = [];
  for (let i = 0; i < bannedCreators.length; i++) {
    bannedCreatorsList.push(bannedCreators[i].username);
  }

  console.log(startPeriod.toUTCString(), endPeriod.toUTCString())
  // get published videos from current period that are eligible for upvotes
  const videos = await mongo.Video.find({
    status: 'published',
    steemPosted: true,
    owner: { $nin: bannedCreatorsList },
    created: { $gte: startPeriod.toISOString(), $lte: endPeriod.toISOString() },
    upvoteEligible: { $ne: false }
  });

  //console.log(videos)
  console.log(videos.length)
  if (videos.length === 0) {
    process.exit(0);
  }

  let totalViews = 0;
  const videoMap = {};
  const creatorList = Array.from(new Set(videos.map(vid => vid.owner)));


  for (const account of creatorList) {
    videoMap[account] = { views: 0, share: 0, videos: {} };
  }

  for (const video of videos) {
    let owner = video.owner;
    let views = video.views;
    let perm = video.permlink;
    let reduced = video.reducedUpvote;
    views = await getRelativeViews(owner, perm, views, reduced)
    console.log(video.created)
    console.log(owner, views)
    totalViews += views;
    videoMap[owner].views += views;
    videoMap[owner].videos.reduced = reduced;
    videoMap[owner].videos[perm] = views;
  }


  let threespeak = (await hiveClient.database.getAccounts([accountName]))[0]
  const vp = calculateVotingMana(threespeak);

  const factor = ((vp - 80) * 5) / 100;

  if (factor <= 0) {
    process.exit(0)
  }

  const operations = [];

  for (const creator in videoMap) {

    let contentCreator = videoMap[creator];
    //share is the weight of the upvotes being given out relative to views, hours between cycles and
    //how much voting power the account has left in it
    contentCreator.share = Math.round(contentCreator.views / totalViews * 10000 * factor * (hoursBetween / 2));
    if (contentCreator.share > 10000) {
      contentCreator.share = 10000;
    }
    if (contentCreator.share > 3000 && contentCreator.videos.reduced) {
      contentCreator.share = 3000;
    }
    //find most popular video
    //don't perform downvotes
    let perm = ''
    let highest = 0
    for (const video in contentCreator.videos) {
      let videoViews = contentCreator.videos[video]
      if (videoViews > highest) {
        highest = videoViews
        perm = video
      }
    }
    if (contentCreator.share > 0) {
      operations.push({
        author: creator,
        permlink: perm,
        weight: Math.round(contentCreator.share)
      });

    }

  }

  await vote(0, operations);

  process.exit(0);
})();

setTimeout(() => {
  process.exit(0)
}, 600 * 1000)