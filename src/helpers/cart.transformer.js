const { rupiahFormat } = require("./rupiah.transformer")

const summaryTransformer = (cart) => {
  const originalPrice = cart.reduce((acc, item) => acc + Math.round(item.product.price) * item.quantity, 0);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce((acc, item) => acc + Math.round(item.product.price), 0)

  return {
    totalPrice: totalPrice,
    totalQuantity: totalQuantity,
    price: {
      raw: originalPrice,
      formated: rupiahFormat(originalPrice)
    },
    sub_total: {
      raw: originalPrice,
      formated: rupiahFormat(originalPrice),
    },
    totalItems: cart.length
  }
}

module.exports = {
  CartSummaryTransformer: (cart) => ({
    ...summaryTransformer(cart)
  }),
}