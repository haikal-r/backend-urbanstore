const objOrder = (order) => ({
  id: order.id,
  token: order.token,
  status: order.status,
  totalPrice: order.totalPrice,
  user: {
    email: order.User.email,
    name: order.User.name,
    address: order.User.address,
  },
  orderItems: order.orderItems.map(orderItem => ({
    id: orderItem.id,
    quantity: orderItem.quantity,
    productName: orderItem.product.name,
    productPrice: Math.round(orderItem.product.price),
    productImages: orderItem.product.images,
    store: {
      name: orderItem.product.Store.name,
      slug: orderItem.product.Store.slug
    }
  })),

})

module.exports = {
  OrderTransformer: (order) => {
    const orderObj = objOrder(order)
    delete orderObj.createdAt
    delete orderObj.updatedAt
    
    return orderObj
  }
}

