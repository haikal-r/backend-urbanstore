const express = require("express")
const CartController = require("./cart.controller")
const { authentication } = require("../../middlewares/authentication.middleware")
const cartController = require("./cart.controller")
const router = express.Router()

router.get("/test", CartController.index)
router.get("/", authentication, CartController.getCart)
router.post("/", authentication, CartController.createCartItem)
router.delete("/", authentication, CartController.deleteCartItem)
router.patch("/", authentication, cartController.updateCartItem)

module.exports = router