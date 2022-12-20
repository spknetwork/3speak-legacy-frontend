const hive = require("@hiveio/hive-js")
const spkTotal = require("./spk_total.json");

const operations = [];

function getTransfer(to, amount, memo) {
  return [
    'transfer',
    {
      from: "threespeakwallet",
      to,
      amount,
      memo
    }
  ]
}

for (const user of Object.keys(spkTotal)) {

  if (user.startsWith("oauth2|Steemconnect") === false) {
    console.log("Skip", user);
    continue;
  }

  const username = user.replace("oauth2|Steemconnect|", "");


  const memo = 'We thank you for your participation in the Speak platform utility token in March 2020, as you will be aware, we deprecated this feature in late 2020. In line with the removal of this feature, we here in provide you with a full refund and due to high work load and other work in progress, we ask your understanding about the time it has taken to return your funds.'

  operations.push(getTransfer(username, spkTotal[user].totalHBD.toFixed(3) + " HBD", memo))
}

// let total = 0;
//
// for (const t of operations) {
//   total += parseFloat(t[1].amount)
// }
//
// console.log(total)
