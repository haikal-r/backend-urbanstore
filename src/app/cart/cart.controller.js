const { StatusCodes: status } = require("http-status-codes");
const CartService = require("./cart.service");
const { apiResponse } = require("../../utils/apiResponse.utils");
const cartService = require("./cart.service");

module.exports = {
  index: async (req, res) => {
    try {
      const serviceResponse = await cartService.index();

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  getCart: async (req, res) => {
    try {
      const serviceResponse = await CartService.getCart(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  createCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.createCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  deleteCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.deleteCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  updateCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.updateCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
};
