require('../page_conf')
const mongo = require('./../helper/mongo');

(async() => {
  let now = new Date()
  let end = new Date(new Date().setMinutes(now.getMinutes() - 15))
  let start = new Date(new Date().setMinutes(now.getMinutes() - 120))
  await mongo.Video.updateMany({status: "encoding", $and: [{created: {$lte: end}}, {created: {$gte: start}}]}, {$set: {status: "encoding_queued"}})
  process.exit(0)
})()
