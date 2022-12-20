require('./page_conf')
const {mongo} = require('./helper')

const userB = 'kaeptn-iglo';
const userA = 'iglo-kaeptn';


mongo.Video.updateMany({
  status: {$in: ["encoding", "encoding_queued"]}
}, {$set: {status: "encoding_failed"}}, (err, res) => {
  console.log(err, res)
})


// mongo.Video.countDocuments({
//   status: {$in: ["encoding", "encoding_queued"]}
// }).then(res => {
//   console.log(res)
// })
