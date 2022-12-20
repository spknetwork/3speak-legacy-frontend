const {mongo, aws} = require('../helper');


// mongo.Video.updateMany({
//   status: "encoding",
//   owner: {$ne: "dgtest123"}
// }, {$set: {status: "encoding_queued"}}).then(async videos => {
//   console.log(videos)
//   process.exit(0)
// })

mongo.Video.findOne({permlink: "dlfnmmjz", owner: "dgtest123"}).then(async video => {
  let job = aws.helper.getEncodingJob(video)
  await aws.helper.sendMessage('video_encoding', job)
  process.exit(0)
})
