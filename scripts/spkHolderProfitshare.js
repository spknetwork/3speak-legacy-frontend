const { config } = require("../config/index.js");
let SSC = require('sscjs');
let hive = require('@hiveio/hive-js');
const ssc = new SSC('https://api.steem-engine.com/rpc');

const accName = config.acctName;
const activeKey = config.wifActive;
const tokenName = 'SPK';

(async() => {

  //get information on all token holders
  let tokenHolders = await ssc.find(
    'tokens',
    'balances',
    {symbol: tokenName},
    1000,
    0,
    [],
    (err, res) => {
      return res
  });

  //calculate circulating supply
  let circulationTotal = 0;
  for (let i = 0; i < tokenHolders.length; i++) {
    circulationTotal += parseFloat(tokenHolders[i].balance);
  }

  //get account info
  hive.api.getAccountsAsync([accName], (err, res) => {
    res = res[0];

    //get balances
    let steemBal = parseFloat(res.balance.replace(' HIVE', ''));
    let sbdBal = parseFloat(res.sbd_balance.replace(' HBD', ''));
    console.log(sbdBal, steemBal);

    //build transaction to distribute steem
    let ops = [];
    for (let i = 0; i < tokenHolders.length; i++) {
      let spkBalance = parseFloat(tokenHolders[i].balance);
      let share = spkBalance/circulationTotal;

      let sbdShare = (sbdBal*share).toFixed(3);
      let steemShare = (steemBal*share).toFixed(3);

      //ignore 0 balances and prevent account from sending to itself
      if (share != 0 && tokenHolders[i].account != accName) {
        //ignore 0 value txs
        if (sbdShare != 0) {
          ops.push(
            ['transfer', {
              from: accName,
              to: tokenHolders[i].account,
              amount: sbdShare.toString() + ' SBD',
              memo: '3Speak profit share for ' + share*100 + '% of circulating supply. Thank you for holding SPK!'
            }]);
        }
        //ignore 0 value txs
        if (steemShare != 0) {
          ops.push(
            ['transfer', {
              from: accName,
              to: tokenHolders[i].account,
              amount: steemShare.toString() + ' HIVE',
              memo: '3Speak profit share for ' + share*100 +'% of circulating supply. Thank you for holding SPK!'
            }]
          )
        }
      }
    }

    //broadcast transactions
    hive.broadcast.send({operations: ops}, [activeKey], (err, res) => {
      console.log(res, err);
      process.exit(0)
    });
  });
})();
