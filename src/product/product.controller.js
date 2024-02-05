const express = require("express");
const prisma = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
  const newProductData = req.body;

  const product = await prisma.product.create({
    data: {
      title: newProductData.title,
      price: newProductData.price,
      description: newProductData.description,
      category: newProductData.category,
      image: newProductData.image,
    },
  });

  res.send({
    data: product,
    message: "create product success",
  });
});

router.get("/", async (req, res) => {
  const product = await prisma.product.findMany();

  res.send(product);
});

module.exports = router