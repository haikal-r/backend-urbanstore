const OrderService = require("./order.service");
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse } = require("../../utils/apiResponse.utils");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.createOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getOrders: async (req, res) => {
    try {
      const serviceResponse = await OrderService.getOrders(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  updateOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.updateOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.getOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
