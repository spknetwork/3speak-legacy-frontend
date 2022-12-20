var express = require('express');
var router = express.Router();
var {mongo} = require('../helper');
router.get('/', async(req, res) => {

  const creator = await mongo.ContentCreator.find({
    username: {$nin: APP_LEADERBOARD_USERNAME_EXCLUSION_LIST},
    banned: false, canUpload: true, hidden: false, score: {$gt: 0}
  }).sort('-score').limit(req.query.long ? 145 : 55);

console.log(creator)

  for (const i in creator) {

    creator[i].pos = parseInt(i) + 1;
    if (creator[i].canProxyUpvote) {

      const upvDay = new Date();
      upvDay.setDate(creator[i].upvoteDay)
      creator[i].upvoteDate = upvDay.toDateString()

    }

  }

  res.render('new/content_creator', {
    content_creator: creator.slice(3),
    first: creator[0],
    second: creator[1],
    third: creator[2],
    showScore: true
  })

});

module.exports = router;
