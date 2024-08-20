const express = require("express");
const StoreController = require("./store.controller");
const ProductController = require("../product/product.controller");
const { optionalAuthentication, authentication } = require("../../middlewares/authentication.middleware");
const multer = require('multer');


const router = express.Router();
const upload = multer()

// Store
router.get("/", optionalAuthentication, StoreController.getStores);
router.get("/user", authentication, StoreController.getStoreByUser)
router.get("/:slug", optionalAuthentication, StoreController.getStore)


router.post("/", authentication, StoreController.createStore);
router.put("/:slug", authentication, StoreController.putStore);
router.patch("/:slug", authentication, StoreController.patchStore);
router.delete("/:slug", authentication, StoreController.deleteStore);

// Products
router.get("/:slug/products", optionalAuthentication, StoreController.getProducts)
router.get("/:slug/products/:productId", optionalAuthentication, StoreController.getProductById)

router.post("/:slug/products", authentication, upload.array('images'),ProductController.createProduct )
router.put("/:slug/products/:productId", authentication, ProductController.putProduct)
router.patch("/:slug/products/:productId", authentication, ProductController.patchProduct)
router.delete("/:slug/products/:productId", authentication, ProductController.deleteProduct)

module.exports = router;
