const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProductById,
  editProductById,
} = require("./product.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getAllProducts();

  res.send(products);
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(parseInt(productId));

    res.send(product);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;
    const product = await createProduct(newProductData);

    res.send({
      data: product,
      message: "create product success",
    });
  } catch (error) {
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    await deleteProductById(parseInt(productId));
    res.send("Product Deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const product = await editProductById(parseInt(productId), productData);

    res.send({
      data: product,
      message: "edit data success",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;

  if (
    !(
      productData.title &&
      productData.description &&
      productData.price &&
      productData.category &&
      productData.image
    )
  ) {
    return res.status(400).send("some fields are missing !");
  }

  const product = await editProductById(parseInt(productId), productData);

  res.send({
    data: product,
    message: "edit data success",
  });
});

module.exports = router;
