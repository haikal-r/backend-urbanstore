const express = require("express");
const ProductController = require("./product.controller");
const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/search", ProductController.getProductsBySearch)
router.get("/categories", ProductController.getAllCategories)
router.get("/:productId", ProductController.getProductByProductId)
router.put("/:id", ProductController.putProduct)
router.patch("/:id", ProductController.patchProduct)
router.delete("/:id", ProductController.deleteProduct)
router.post("/category", ProductController.createCategory)
router.get("/category/:slug", ProductController.getProductByCategorySlug)

module.exports = router;
