const objProductCart = (product) => ({
  id: product.id,
  productId: product.product.id,
  storeId: product.product.storeId,
  quantity: product.quantity,
  images: product.product.images,
  stock: product.product.stock,
  name: product.product.name,
  slug: product.slug,
  price: Math.round(product.product.price),
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
})

const objProduct = (product) => ({
  id: product.id,
  uuid: product.uuid,
  store: product.Store.name,
  category: product.Category.name,
  name: product.name,
  slug: product.slug,
  price: product.price,
  stock: product.stock,
  description: product.description,
  images: product.images,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
})

module.exports = {
  ProductCartTransformer: (product) => {
    const productObj = objProductCart(product)
    delete productObj.slug
    delete productObj.description
    delete productObj.createdAt
    delete productObj.updatedAt

    return productObj
  },
  ProductTransformer: (product) => {
    const productObj = objProduct(product)
    delete productObj.createdAt
    delete productObj.updatedAt
    
    return productObj
  }
}

