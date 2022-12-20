require('../page_conf')
const mongo = require('./../helper/mongo');
const hive = require('@hiveio/hive-js');
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}`});

const BADGE_NAME = 'threespeak_witness_vote';

function addBadge(badges = []) {
  if (!badges.includes(BADGE_NAME)) {
    console.log('Adding Badge!')
    badges.push(BADGE_NAME)
  }

  return badges;
}

function removeBadge(badges = []) {
  let newBadges = [];

  if (!badges.includes(BADGE_NAME)) {
    console.log("Creator does not have the badge and doesn't vote our witness.")
    newBadges = badges
  } else {
    for (let badge of badges) {
      if (badge !== BADGE_NAME) {
        newBadges.push(badge)
      }
      if (badge === BADGE_NAME) {
        console.log('Removing Badge :(')
      }
    }
  }

  return newBadges
}

(async() => {

  const creators = await mongo.ContentCreator.find({banned: false, hidden: false});

  for (let creator of creators) {
    try {
      let needSave = false;
      console.log('======================')
      console.log('Checking creator:', creator.username);

      const [account] = await hive.api.getAccountsAsync([creator.username]);

      if (account) {
        if (account.witness_votes && account.witness_votes.includes('threespeak')) {
          if (!creator.badges.includes(BADGE_NAME)) {
            needSave = true;
          }
          creator.badges = addBadge(creator.badges, creator.username)
        } else {
          if (creator.badges.includes(BADGE_NAME)) {
            needSave = true;
          }
          creator.badges = removeBadge(creator.badges, creator.username)
        }
        if (needSave) {
          await creator.save();
        }

      }
    } catch (e) {
      console.log(e)
    }

  }

  process.exit()

})();

process
  .on('unhandledRejection', async(e) => {
    console.log(e)
  })
  .on('uncaughtException', async(e) => {
    console.log(e)
  });
