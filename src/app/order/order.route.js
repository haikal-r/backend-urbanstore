const express = require("express")
const OrderController = require("./order.controller")
const { authentication } = require("../../middlewares/authentication.middleware")


const router = express.Router()

router.get("/", authentication, OrderController.getOrders)
router.get("/:id", authentication, OrderController.getOrder)

router.post("/", authentication, OrderController.createOrder)
router.patch("/:id", authentication, OrderController.updateOrder)

module.exports = router