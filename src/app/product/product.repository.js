const prisma = require("../../db");

const findProducts = async () => {
  const product = await prisma.product.findMany();

  return product
}

const findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where : {
      id: id
    }
  })

  return product
}

const insertProduct = async (newProductData) => {
  const product = await prisma.product.create({
    data: {
      title: newProductData.title,
      price: newProductData.price,
      description: newProductData.description,
      category: newProductData.category,
      image: newProductData.image,
    },
  });

  return product

}
  
const deleteProduct = async (id) => {
  await prisma.product.delete({
    where: {
      id,
    }
  })
}

const editProduct = async (id, productData) => {
  const product = await prisma.product.update({
    where:{
      id: id
    },
    data: {
      title: productData.title,
      description: productData.description,
      image: productData.image,
      price: productData.price,
    }
  })

  return product
}

module.exports = {
  findProducts,
  insertProduct,
  findProductById,
  deleteProduct,
  editProduct,
}