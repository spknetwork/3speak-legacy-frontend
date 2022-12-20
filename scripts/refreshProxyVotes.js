require('../page_conf')
const mongo = require('./../helper/mongo');

mongo.ContentCreator.updateMany(
  {canProxyUpvote: true},
  {canProxyUpvote: false, upvoteDay: 0, limit: 0},
  {upsert: true},
  function() {
    mongo.CreatorVote.deleteMany({}).then(e => {
      mongo.ContentCreator.find({queuedCanProxyUpvote: true}).then((docs) => {
        docs.forEach((doc, index, array) => {
          doc.canProxyUpvote = doc.queuedCanProxyUpvote;
          doc.upvoteDay = doc.queuedUpvoteDay;
          doc.limit = doc.queuedLimit;
          doc.save().then(() => {
            if (index === array.length - 1) {
              process.exit(0);
            }
          })
        })
      });
    })
  });
