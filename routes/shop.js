const { config } = require("../config/index.js");
require('../page_conf');
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch')
const requireLogin = require('./middleware/requireLogin');
const {mongo, admins} = require('../helper')
const mssql = require('mssql');
const numeral = require('numeral');
const hive = require('@hiveio/hive-js');
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api','true');
hive.broadcast.updateOperations();
const hivesql = mssql.connect(`mssql://${HIVESQL_USER}:${HIVESQL_PASSWORD}@${HIVESQL_HOST}/${HIVESQL_DATABASE}`)

router.get('/', requireLogin, async(req, res) => {


  let query = {published: true};
  if (admins.includes(req.session.user.user_id)) {

    query = {}

  }

  const products = await mongo.Product.find(query);

  res.render('new/shop', {products});

});

router.get('/buy/:id/:currency', requireLogin, async(req, res) => {

  const product = await mongo.Product.findOne({_id: req.params.id});

  if (product === null) {

    return res.redirect('/shop')

  }

  if (!product.currencies.includes(req.params.currency)) {

    return res.redirect('/shop')

  }

  // MUST BE == and NOT === !!! - Require channel parameter and make sure its a technically valid hive account
  if (product._id == '5f3faf7a9a0029e790272e06') {

    if (!req.query.channel || hive.utils.validateAccountName(req.query.channel) !== null) {

      return res.redirect('/shop')

    }


    const creator = await mongo.ContentCreator.findOne({username: req.query.channel, canSubscribed: true});

    if (creator === null) {

      return res.redirect('/shop')

    }

  }

  async function getFromUSD(usd, currency) {

    switch (currency) {

      case 'hbd':
        currency = 'hive_dollar'

    }

    let marketPrice = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`)).json();
    marketPrice = marketPrice[currency].usd;

    return Math.round(usd / marketPrice * 1000) / 1000;

  }

  const order = new mongo.Order({
    user_id: req.session.user.user_id,
    created_at: Date.now(),
    json_metadata: JSON.stringify(req.query),
    products: [{
      name: product.name,
      description: product.description,
      price_usd: product.price_usd,
      price_currency: await getFromUSD(product.price_usd, req.params.currency.toLowerCase()),
      fee_percent: SHOP_FEE,
      quantity: 1
    }],
    currency: req.params.currency
  })

  await order.save();

  res.redirect('/shop/checkout/' + order._id);

});

router.get('/checkout/:id', requireLogin, async(req, res) => {

  const order = await mongo.Order.findOne({_id: req.params.id, user_id: req.session.user.user_id === config.admin ? req.query.userId ? req.query.userId : config.admin : req.session.user.user_id});

  if (order === null) {

    return res.redirect('/shop');

  }

  if (order.status === 'tx_found') {

    function getMainTransferAccount(order) {

      if (order.json_metadata && order.json_metadata.length > 0) {

        const metadata = JSON.parse(order.json_metadata);
        if (metadata.channel) {

          return hive.utils.validateAccountName(metadata.channel) === null ? metadata.channel : 'threespeakwallet'

        }

      }

      return 'threespeakwallet'

    }

    let total_currency = 0

    for (const p of order.products) {

      total_currency += p.quantity * p.price_currency

    }

    console.log('Finding:', {
      memo: 'payment:' + order._id,
      currency: order.currency,
      receiver: getMainTransferAccount(order),
      amount: total_currency
    })

    const con = await hivesql;
    const result = await con
      .request()
      .input('memo', 'payment:' + order._id)
      .input('currency', order.currency)
      .input('receiver', getMainTransferAccount(order))
      .input('amount', total_currency)
      .query('select * from TxTransfers where memo = @memo  and [to] = @receiver and amount = @amount and amount_symbol = @currency')

    if (result.recordset.length >= 1) {

      //payment found. look for fees next.
      const feeResult = await con
        .request()
        .input('memo', 'fee:' + order._id)
        .input('currency', order.currency)
        .input('receiver', 'threespeakwallet')
        .input('amount', numeral(total_currency * (order.products[0].fee_percent / 100)).format('0.000'))
        .query('select * from TxTransfers where memo = @memo  and [to] = @receiver and amount = @amount and amount_symbol = @currency');
      if (feeResult.recordset.length >= 1) {

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

  let metadata = {}

  if (order.json_metadata && order.json_metadata.length > 0) {

    metadata = JSON.parse(order.json_metadata)

  }

  res.render('new/shop/checkout', {order, metadata, tx_found: req.query.hasOwnProperty('tx_found')})

})

router.post('/checkout/:id', requireLogin, async(req, res) => {

  const order = await mongo.Order.findOne({_id: req.params.id, user_id: req.session.user.user_id === config.admin ? req.query.userId ? req.query.userId : config.admin : req.session.user.user_id});

  if (order === null) {

    return res.redirect('/shop');

  }

  if (!req.body.id) {

    return res.redirect('/shop');

  }

  order.payment_tx_id = req.body.id;
  order.status = 'tx_found';
  await order.save();

  res.redirect(`/shop/checkout/${order._id}`)

})

router.get('/orders', requireLogin, async(req, res) => {

  const orders = await mongo.Order.find({user_id: req.session.user.user_id === config.admin ? req.query.userId ? req.query.userId : config.admin : req.session.user.user_id}).sort('-created_at');

  res.render('new/shop/orders', {orders})

})

module.exports = router;
