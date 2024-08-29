const OrderService = require("./order.service");
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse } = require("../../utils/apiResponse.utils");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.createOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e)
    }
  },
  getOrders: async (req, res) => {
    try {
      const serviceResponse = await OrderService.getOrders(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e)
    }
  },
  updateOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.updateOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e)
    }
  },
  getOrder: async (req, res) => {
    try {
      const serviceResponse = await OrderService.getOrder(req);

      res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e)
    }
  },
};
