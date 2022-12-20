require('../page_conf')
const {mongo} = require('../helper');

(async() => {

  let date = new Date()
  date.setDate(date.getMinutes()-120)
  await mongo.Video.updateMany({status: 'encoding', created: {$lt: date}}, {$set: {status: 'encoding_failed'}})
  process.exit(0)

})()
