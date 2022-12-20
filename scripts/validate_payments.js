require('../page_conf');

// pending
const mssql = require('mssql');
const {mongo} = require('../helper');
const hivesql = mssql.connect(`mssql://${HIVESQL_USER}:${HIVESQL_PASSWORD}@${HIVESQL_HOST}/${HIVESQL_DATABASE}`)
const hive = require('@hiveio/hive-js');
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
const numeral = require('numeral');

function getMainTransferAccount(order) {
  if (order.json_metadata && order.json_metadata.length > 0) {
    const metadata = JSON.parse(order.json_metadata);
    if (metadata.channel) {
      return hive.utils.validateAccountName(metadata.channel) === null ? metadata.channel : 'threespeakwallet'
    }
  }
  return 'threespeakwallet'
}

(async() => {
  const orders = await mongo.Order.find({status: 'pending'});

  const hiveSQL = await hivesql;

  for (order of orders) {

    let total_currency = 0

    for (const p of order.products) {

      total_currency += p.quantity * p.price_currency

    }

    console.log('===============')
    console.log('Check Order:', order._id)
    const result = await hiveSQL
      .request()
      .input('memo', 'payment:' + order._id)
      .input('currency', order.currency)
      .input('receiver', getMainTransferAccount(order))
      .input('amount', total_currency)
      .query('select * from TxTransfers where memo = @memo  and [to] = @receiver and amount = @amount and amount_symbol = @currency')

    if (result.recordset.length >= 1) {
      console.log('Payment Found:', {
        memo: 'payment:' + order._id,
        currency: order.currency,
        receiver: getMainTransferAccount(order),
        amount: total_currency
      })
      //payment found. look for fees next.
      const feeResult = await hiveSQL
        .request()
        .input('memo', 'fee:' + order._id)
        .input('currency', order.currency)
        .input('receiver', 'threespeakwallet')
        .input('amount', numeral(total_currency * (order.products[0].fee_percent / 100)).format('0.000'))
        .query('select * from TxTransfers where memo = @memo  and [to] = @receiver and amount = @amount and amount_symbol = @currency');
      if (feeResult.recordset.length >= 1) {
        console.log('Fee Found:', {
          memo: 'payment:' + order._id,
          currency: order.currency,
          receiver: getMainTransferAccount(order),
          amount: total_currency
        })
        order.status = 'paid';
        order.paid_at = Date.now();

        if (order.products[0].name === 'Channel Subscription') {

          const now = new Date();
          now.setDate(now.getDate() + 30);
          const sub = new mongo.ChannelSubscription({
            user_id: req.session.user.user_id,
            channel: getMainTransferAccount(order),
            order_id: order._id,
            ends_at: now
          });

          await sub.save();
          order.status = 'fulfilled';
          await order.save();

        }

        await order.save();

      }

    }
  }

  process.exit(0)
})();
