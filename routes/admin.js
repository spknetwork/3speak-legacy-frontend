const express = require('express');
const router = express.Router();
const {mongo} = require('../helper');
const requireAdmin = require('./middleware/requireAdmin');

async function allAccounts() {

  const allAccounts = await mongo.ContentCreator.find({});
  const allAccountsList = [];
  for (let i = 0; i < allAccounts.length; i++) {

    allAccountsList.push(allAccounts[i].username)

}
  return allAccountsList

}

router.get('/', requireAdmin, async(req, res) => {

    const verificationCount = await mongo.ContentCreator.countDocuments({awaitingVerification: true});
    const curationCount = await mongo.Video.countDocuments({
        status: 'published',
        curationComplete: {$ne: true},
        created: {$gt: new Date().setHours(new Date().getHours() - 30)}
    });
    const banCount = await mongo.ContentCreator.countDocuments({$or: [{banned: true}, {canUpload: false}, {upvoteEligible: false}]});
    const now = new Date();
    const reviewPeriod = now.getDate() >= 23;
    res.render('new/admin_dashboard', {verificationCount, curationCount, banCount, reviewPeriod})

});

router.get('/verification', requireAdmin, async(req, res) => {

    const inboxVerifications = await mongo.InboxVerification.find({sent: {$ne: true}});
    const inboxNames = inboxVerifications.map(a => a.spkUser);

    const accounts = await mongo.ContentCreator.find({awaitingVerification: true, username: {$nin: inboxNames}});
    const requiredAccounts = await mongo.ContentCreator.find({verificationRequired: true, verified: false});
    const embed = req.query.embed ? true : false;
    res.render('new/admin_verificationRequests', {accounts, requiredAccounts, embed, inboxVerifications})

});

router.get('/verification/complete', async(req, res) => {

  const inboxVerification = await mongo.InboxVerification.findOne({verifyId: req.query.code});
  if (inboxVerification === null) {

    return res.render('new/admin_verificationComplete', {valid: false})

}
    await mongo.ContentCreator.updateOne({username: inboxVerification.spkUser}, {verified: true, verificationPending: false}, {upsert: true});
    return res.render('new/admin_verificationComplete', {valid: true})

});

router.get('/api/verification/complete', async(req, res) => {

  res.redirect('/admin/verification/complete?code='+req.query.code)

});

router.get('/curation', requireAdmin, async(req, res) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(date.getHours() -6);
    const query = {
      status: 'published',
      curationComplete: {$ne: true},
      created: {$gte: date}
    };
    if (req.query.user) {
      query.owner = req.query.user;
    }
    if (req.query.excludeLeo) {
      query.owner = { $not: /leoshort.+/ };
    }
    const videos = await mongo.Video.find(query).sort('-created').limit(12);
    res.render('new/admin_curation', {title: 'Express', videos, allAccountsList: []})
});

router.get('/banlist', requireAdmin, async(req, res) => {

  const accounts = await mongo.ContentCreator.find({$or: [{banned: true}, {canUpload: false}, {upvoteEligible: false}, {reducedUpvote: true}]});
  const allAccountsList = []

  res.render('new/admin_banList', {accounts, allAccountsList})

});

router.get('/voteDistributors', requireAdmin, async(req, res) => {

  let accounts;
  const now = new Date();
  const privateReview = now.getDate() >= 23;

  if (privateReview) {

    accounts = await mongo.ContentCreator.find({queuedCanProxyUpvote: true}).sort('queuedUpvoteDay');

} else {

    accounts = await mongo.ContentCreator.find({canProxyUpvote: true}).sort('upvoteDay');

}

  const allAccounts = []

  res.render('new/admin_voteDistributors', {accounts, allAccounts, privateReview})

});

router.get('/creatorDm', requireAdmin, async(req, res) => {

  const allAccountsList = []
  res.render('new/admin_creatorDm', {allAccountsList})

});

router.get('/strikes', requireAdmin, async(req, res) => {

  const accounts = await mongo.ContentCreator.find({strikes: {$gt: []}});
  const allAccountsList = await allAccounts();
  res.render('new/admin_strikes', {accounts, allAccountsList})

});

router.get('/unique', requireAdmin, async(req, res) => {

  res.render('new/admin_uniqueViews')

})


router.post('/api/views', requireAdmin, async(req, res) => {

  let view = await mongo.View.findOne({permlink: req.body.permlink})
  console.log(view)

  let video = await mongo.Video.findOne({permlink: req.body.permlink})
  let views = video.views

  let unique = await mongo.View.distinct('userIP', {permlink: req.body.permlink})
  unique = unique.length

  res.json({views, unique})

})

router.get('/api/username_autocomplete', requireAdmin, async(req, res) => {

  let usernames = await mongo.ContentCreator.distinct("username", {username: {$regex: req.query.arg}})
  

  res.json({usernames})
})

router.post('/api/verification/approve', requireAdmin, async(req, res) => {

    const creator = await mongo.ContentCreator.findOne({username: req.body.username});

    if (req.body.valid == 'true') {

        creator.verified = true;
        creator.awaitingVerification = false;
        creator.verificationRequired = false;
        creator.canUpload = true;
        creator.banned = false;
        creator.upvoteEligible = true;

} else {

        creator.verified = false;
        creator.awaitingVerification = false;
        creator.warningPending = true;
        creator.warningText = 'Your verification evidence has been rejected. This is likely because there was no ' +
            'reference to 3speak in the evidence you supplied, or the evidence was insufficient. Please resubmit.';

}

    await creator.save();
    res.send()

});

router.post('/api/verification/require', requireAdmin, async(req, res) => {

    const creator = await mongo.ContentCreator.findOne({username: req.body.username});
    if (creator === null) {

        return res.json({error: 'Invalid username.'})

}
    creator.verificationRequired = true;
    creator.verificationRequiredDate = new Date();
    creator.warningPending = true;
    creator.warningText = 'Please verify. If you do not verify, you likely will not be eligible for upvotes and hive rewards.';
    await creator.save();
    res.send()

});

router.post('/api/verification/message-sent', requireAdmin, async(req, res) => {

  await mongo.InboxVerification.updateOne(
    {spkUser: req.body.spkUser},
    {sent: true},
    {upsert: true});
  res.send();

});

router.post('/api/verification/deleteMsgReq', requireAdmin, async(req, res) => {

  await mongo.InboxVerification.deleteOne({spkUser: req.body.spkUser});
  res.send()

});

router.post('/api/verification/withdraw', requireAdmin, async(req, res) => {

  await mongo.ContentCreator.updateOne({username: req.body.username}, {verificationRequired: false});
  res.send()

});

router.post('/api/uploadban', requireAdmin, async(req, res) => {

    const creator = await mongo.ContentCreator.findOne({username: req.body.username});
    if (creator === null) {

        return res.json({error: 'Invalid username.'})

}
    creator.canUpload = req.body.checked;
    if (req.body.checked == 'false') {

        creator.banReason = 'You have been requested to verify your identity before we allow you to continue uploading.'

}
    await creator.save();
    res.send()

});

router.post('/api/fullban', requireAdmin, async(req, res) => {

  const creator = await mongo.ContentCreator.findOne({username: req.body.username});
  if (creator === null) {

    return res.json({error: 'Invalid username.'})

}
  creator.banned = req.body.checked;
  await creator.save();
  res.send()

});

router.post('/api/voteban', requireAdmin, async(req, res) => {

  const creator = await mongo.ContentCreator.findOne({username: req.body.username});
  if (creator === null) {

    return res.json({error: 'Invalid username.'})

}
  creator.upvoteEligible = !JSON.parse(req.body.checked);
  await creator.save();
  res.send()

});

router.post('/api/votereduce', requireAdmin, async(req, res) => {

  const creator = await mongo.ContentCreator.findOne({username: req.body.username})

  if (creator === null) {
    return res.json({error: 'Invalid username.'})
  }

  creator.reducedUpvote = JSON.parse(req.body.checked)
  await creator.save();
  res.send()
})

router.post('/api/curation/toggleNSFW', requireAdmin, async(req, res) => {

    const video = await mongo.Video.findOne({owner: req.body.author, permlink: req.body.permlink});
    video.isNsfwContent = !video.isNsfwContent;
    video.save();

});

router.post('/api/curation/toggleRecommended', requireAdmin, async(req, res) => {

    const video = await mongo.Video.findOne({owner: req.body.author, permlink: req.body.permlink});
    video.recommended = !video.recommended;
    video.save();

});

router.post('/api/curation/upvote', requireAdmin, async(req, res) => {

    const video = await mongo.Video.findOne({owner: req.body.author, permlink: req.body.permlink});

    video.upvoteEligible = !video.upvoteEligible;
    video.save();

});

router.post('/api/curation/reduced-upvote', requireAdmin, async(req, res) => {

  const video = await mongo.Video.findOne({owner: req.body.author, permlink: req.body.permlink})

  video.reducedUpvote = !video.reducedUpvote;
  video.save();

})

router.post('/api/curation/complete', requireAdmin, async(req, res) => {

    const video = await mongo.Video.findOne({owner: req.body.author, permlink: req.body.permlink});
    video.curationComplete = !video.curationComplete;
    await video.save();
    res.json({msg: 'success'});

});

router.post('/api/voteDistributors/remove', requireAdmin, async(req, res) => {

  if (req.body.privateReview == 'true') {

    await mongo.ContentCreator.updateOne({username: req.body.username}, {queuedCanProxyUpvote: false}, {upsert: true});

} else {

    await mongo.ContentCreator.updateOne({username: req.body.username}, {canProxyUpvote: false}, {upsert: true});

}

  res.send()

});

router.post('/api/voteDistributors/add', requireAdmin, async(req, res) => {

  if (req.body.privateReview == 'true') {

    await mongo.ContentCreator.updateOne(
      {username: req.body.username},
      {queuedCanProxyUpvote: true, queuedUpvoteDay: req.body.day, queuedLimit: req.body.value},
      {upsert: true});

} else {

    await mongo.ContentCreator.updateOne(
      {username: req.body.username},
      {canProxyUpvote: true, upvoteDay: req.body.day, limit: req.body.value},
      {upsert: true});

}
  res.send()

});

router.post('/api/creatorDm/send', requireAdmin, async(req, res) => {

  await mongo.ContentCreator.updateOne(
    {username: req.body.user},
    {warningPending: true, warningText: req.body.message},
    {upsert: true});
  res.send();

});

router.post('/api/strikes/add', requireAdmin, async(req, res) => {

  const acc = await mongo.ContentCreator.findOne({username: req.body.user});
  acc.strikes.push(req.body.message);
  await acc.save();
  res.send();

});

module.exports = router;
