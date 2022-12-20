require('../page_conf')
const {mongo} = require('../helper');

const productRegex = /^Trending Boost.*/;
const productPowerRegex = /^Trending Boost \((\d{1,2}).*/;

(async () => {

  const orders = await mongo.Order.find({status: "paid"});

  for (let order of orders) {
    let use = order.products[0].name.match(productRegex);
    if (use !== null) {

      let strength = productPowerRegex.exec(order.products[0].name);
      if (strength.length >=2) {
        strength = strength[1];

        let boost =  new mongo.VideoBoost({
          user_id: order.user_id,
          order_id: order._id,
          boost: strength
        })

        await boost.save();
        order.status = 'fulfilled';
        await order.save();

      }
    }
  }

  process.exit(0)
})();
