require('../page_conf')
const mongo = require('./../helper/mongo');

async function getTopCreators() {
  const creators = await mongo.ContentCreator.find({
    banned: false, canUpload: true, hidden: false
  }).sort('-score').limit(30);
  return creators;
}

mongo.ContentCreator.updateMany(
  {queuedCanProxyUpvote: true},
  {queuedCanProxyUpvote: false, queuedUpvoteDay: 0, queuedLimit: 0},
  {upsert: true},
  function(err, res) {

    // find top 30 creators and grant access to proxy vote
    getTopCreators().then(creators  => {

      for (let i = 30; i > 0; --i) {

        const creator = creators[30 - i];
        // reduce days for febuary
        if (new Date().getMonth() === 2) {i = i-2}
        mongo.ContentCreator.updateOne(
          {username: creator.username},
          {queuedCanProxyUpvote: true, queuedUpvoteDay: i, queuedLimit: 20 + i},
          {upsert: true},
          function(err, res) {

            if (i === 1) {
              process.exit(0)
            }
          });
      }
    });
  });
