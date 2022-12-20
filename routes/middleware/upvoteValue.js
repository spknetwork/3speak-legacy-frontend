const hive = require('@hiveio/hive-js');
const moment = require('moment');
const fetch = require('node-fetch');

hive.api.setOptions({useAppbaseApi: true, rebranded_api: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api','true');
hive.broadcast.updateOperations();
function getEffectiveVestingShares(account) {

     const effectiveVestingShares = parseFloat(account.vesting_shares) +
         parseFloat(account.received_vesting_shares) -
         parseFloat(account.delegated_vesting_shares);
     return effectiveVestingShares;

}

function calculateVotingMana(account) {

    const elapsed = moment.utc().unix() - account.voting_manabar.last_update_time;
    const maxMana = getEffectiveVestingShares(account) * 1000000;
    let currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;

    if (currentMana > maxMana) {

        currentMana = maxMana;

}

    const currentManaPerc = currentMana / maxMana * 100;

    return currentManaPerc;

}

function calculateVoteValue(
    account,
    recentClaims,
    rewardBalance,
    price,
    weight = 10000
) {

    const vests = getEffectiveVestingShares(account);
    const vp = parseFloat(calculateVotingMana(account)) * 100;
    const vestingShares = parseInt(vests * 1e6, 10);
    const power = vp * weight / 10000 / 50;
    const rshares = power * vestingShares / 10000;
    return rshares / recentClaims * rewardBalance * (parseFloat(price.base) / parseFloat(price.quote));

}

function calculateVoteWeight(
    account,
    recentClaims,
    rewardBalance,
    price,
    dollars
) {

    const vests = getEffectiveVestingShares(account);
    const vp = parseFloat(calculateVotingMana(account)) * 100;
    const vestingShares = parseInt(vests * 1e6, 10);
    const rshares = dollars / (parseFloat(price.base) / parseFloat(price.quote)) / rewardBalance * recentClaims;
    const power = rshares * 10000 / vestingShares;
    return power * 50 * 10000 / vp;

}

async function weightToDollars(req, res, next) {

    const weight = req.body.weight;
    const username = req.body.username;
    let acc;
    let reward_balance;
    let recent_claims;

    await hive.api.getRewardFund('post', function(error, fund) {

        reward_balance = parseFloat(fund.reward_balance)
        recent_claims = parseInt(fund.recent_claims)

});

    hive.api.getAccounts([username], function(error, account) {

        acc = JSON.parse(JSON.stringify(account[0]));
        hive.api.getCurrentMedianHistoryPrice(function(error, price) {

            let estimate = calculateVoteValue(acc, recent_claims, reward_balance, price, weight);

            const roundedEstimate = Math.round(estimate);
            if (roundedEstimate === 1) {


                estimate = estimate / 1.6

} else if (roundedEstimate === 2) {

                estimate = estimate / 1.4

}

            req.data = {estimate};
            next()

});

});

}

async function dollarsToWeight(req, res, next) {

    const estimate = req.query.dollars ? Math.round(req.query.dollars) : Math.round(req.body.estimate);
    const username = 'threespeak';
    let reward_balance;
    let recent_claims;
    let price;

    await hive.api.getRewardFund('post', function(error, fund) {

        reward_balance = parseFloat(fund.reward_balance)
        recent_claims = parseInt(fund.recent_claims)

    });

    hive.api.getCurrentMedianHistoryPrice(function(error, p) {

        price = JSON.parse(JSON.stringify(p));

        hive.api.getAccounts([username], function(error, account) {

            account = JSON.parse(JSON.stringify(account[0]));

            let weight = Math.round(
                calculateVoteWeight(account, recent_claims, reward_balance, price, estimate)
            );

            const roundedEstimate = Math.round(estimate);

            fetch('https://api.coingecko.com/api/v3/simple/price?ids=HIVE&vs_currencies=USD')
              .then(r => r.json())
              .then(r => {
                let original = 0.22
                let hiveUSD = r.hive.usd
                let change
                let decrease = original > hiveUSD
                if (decrease) {
                  change = original-hiveUSD
                } else {
                  change = hiveUSD-original
                }
                let percent_change = change/original*100
                if (decrease) {
                  percent_change = 1/percent_change
                }

                if (roundedEstimate === 1) {

                  weight *= 1.584*percent_change

                } else if (estimate === 2) {

                  weight *= 1.391*percent_change

                } else if (estimate === 3) {

                  weight *= 1.433*percent_change

                } else if (estimate === 4) {

                  weight *= 1.369*percent_change

                }

                weight = Math.round(weight);

                req.data = {weight};
                next()
              })



});

});


}

module.exports.weightToDollars = weightToDollars;
module.exports.dollarsToWeight = dollarsToWeight;
