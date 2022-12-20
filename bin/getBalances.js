require('../page_conf')
const {mongo} = require('../helper');

const fetch = require('node-fetch');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function getValueAtDate(amount, date) {

  const jsDate = new Date(date);

  const queryDate = jsDate.getDate() + '-' + jsDate.getMonth() + '-' + jsDate.getFullYear()

  const data = await (await fetch('https://api.coingecko.com/api/v3/coins/steem/history?date=' + queryDate)).json()
  const usd_price = data.market_data.current_price.usd;

  await sleep(2000)
  return amount * usd_price

}



mongo.SpeakOrder.aggregate([
  {
    '$match': {
      'status': 'settled'
    }
  }, {
    '$project': {
      'timestamp': 1,
      'userId': 1,
      'amount': 1,
      'price': 1
    }
  }
]).then(async data => {

  for (let i = 0; i < data.length; i++) {

    let set = data[i];
    let index = i + 1
    console.log('Calculating USD Value:', index + '/' + data.length, set._id, set.amount)
    set.usd_price = await getValueAtDate(set.price, set.timestamp)
    console.log('USD Value is:', set.usd_price)
    data[i] = set;
    console.log('============================')
  }

  console.table(data)
})
