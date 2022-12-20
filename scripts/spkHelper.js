
function toFixed(num, fixed) {

  let pos = (num).toString().indexOf(".");
  let add;
  if (pos === -1) {
    pos = (num).toString().length
    add = "." + "0".repeat(fixed)
  } else {
    add = (num).toString().substr(pos,pos+fixed)
    while (add.length <= 3) {
      add += "0"
    }
  }

  let pre = (num).toString().substr(0,pos);
  console.log(pre)

  return pre.toString()+add.toString()

}

function getTotalPrice(amount, discount = 1) {

  function getTokenPrice(amount) {
    if (amount <= 500) {
      return 0.016
    }

    if (amount <= 1000) {
      return 0.015
    }

    return 0.014
  }

  function calculateFee(total) {
    return total * 0.029 + 0.25
  }

  const price = getTokenPrice(amount);
  const finalPrice = price * amount;
  const fees = calculateFee(finalPrice);

  return {
    quantity: amount,
    discount: discount < 1 ? 1 - discount : 0,
    total: {
      display: toFixed(((finalPrice+fees) * discount),3)

    }
  };

}

module.exports.getTotalPrice = getTotalPrice;
