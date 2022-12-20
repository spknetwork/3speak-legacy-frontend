const orders = require("./orders.json")
const ordersStripe = require("./orders_stripe.json");
const fetch = require("node-fetch");

const combined = {};

async function getHBDPrice() {
  return (await fetch("https://min-api.cryptocompare.com/data/price?fsym=HBD&tsyms=USD")).json()
}

getHBDPrice().then(price => {
  for (const order of orders) {
    let user = combined[order.userId] || {userId: order.userId, total: 0};

    user.total += order.usd_value;

    combined[order.userId] = user;

  }

  for (const order of ordersStripe) {
    let user = combined[order.userId] || {userId: order.userId, total: 0};

    user.total += order.usd_value;

    combined[order.userId] = user;

  }

  let totalHBD = 0;

  for (const user of Object.keys(combined)) {
    combined[user].totalHBD = (combined[user].total / price.USD) * 1.10;
    totalHBD += combined[user].totalHBD;
  }


  require("fs").writeFileSync("spk_total.json", JSON.stringify(combined, null, true))

  console.table(combined)
  console.log(totalHBD)

})

