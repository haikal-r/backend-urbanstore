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
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getCart: async (req, res) => {
    try {
      const serviceResponse = await CartService.getCart(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  createCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.createCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  deleteCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.deleteCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  updateCartItem: async (req, res) => {
    try {
      const serviceResponse = await CartService.updateCartItem(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
