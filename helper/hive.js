const { config } = require("../config/index.js");
const hive = require('@hiveio/hive-js');

function createAccountWithAuthority(newAccountname, authorityAccountname, activeKey) {
  const owner = {
    weight_threshold: 1,
    account_auths: [[authorityAccountname, 1]],
    key_auths: []
  };
  const active = {
    weight_threshold: 1,
    account_auths: [[authorityAccountname, 1]],
    key_auths: []
  };
  const posting = {
    weight_threshold: 1,
    account_auths: [[authorityAccountname, 1]],
    key_auths: []
  };
  const memo_key = config.memo;

  const accountData = {
    creator: authorityAccountname,
    new_account_name: newAccountname,
    owner,
    active,
    posting,
    memo_key,
    json_metadata: JSON.stringify({
      'beneficiaries': [
        {
          'name': 'threespeak',
          'weight': 500,
          'label': 'provider'
        }
      ]
    })
  };

  const operations = [
    ['create_claimed_account', accountData]
  ]

  return hive.broadcast.sendAsync({
    operations
  }, {active: activeKey})
}

async function hiveUsernameAvailable(username) {
  return (await hive.api.getAccountsAsync([username]))[0] === undefined
}

module.exports = {
  createAccountWithAuthority,
  hiveUsernameAvailable
}
