require('../page_conf')
const {mongo} = require('../helper');

function getDaysInMonth(m, y) {
  return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}

(async () => {

  async function getStatistics(month, year) {
    const today = new Date();
    today.setUTCMonth(month - 1)
    today.setUTCFullYear(year)
    const monthStart = today.setDate(1)
    const monthEnd = today.setDate(getDaysInMonth(today.getUTCMonth(), today.getUTCFullYear()))

    const query = {
      created: {
        $lt: monthEnd,
        $gte: monthStart
      }
    };

    const encodingFailed = await mongo.Video.countDocuments(Object.assign({status: 'encoding_failed'}, query));
    const encodingSuccessful = await mongo.Video.countDocuments(Object.assign({status: 'published'}, query));

    return {
      encodingFailed,
      encodingSuccessful
    }
  }

  const today = new Date();
  today.setUTCFullYear(2020)


  const monthsToCheck = today.getUTCFullYear() < (new Date()).getUTCFullYear() ? 12 : today.getUTCMonth() + 1
  for (let month = 1; month <= monthsToCheck; month++) {
    const {encodingFailed, encodingSuccessful} = await getStatistics(month, today.getUTCFullYear());
    console.log("Year:", today.getUTCFullYear())
    console.log("Month:", month)
    console.log("Failed Encodings:", encodingFailed)
    console.log("Successful Encodings:", encodingSuccessful);
    const failRate = (encodingFailed / encodingSuccessful * 100)
    console.log("Fail Rate:", failRate, "%");
    console.log("Success Chance:", 100 - failRate, "%");

    console.log("======================================")
  }



  process.exit(0);

})();
