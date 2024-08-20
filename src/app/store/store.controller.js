const { StatusCodes:status } = require("http-status-codes")
const StoreService = require("./store.service")
const { apiResponse } = require("../../utils/apiResponse.utils")

module.exports = {
  getStores: async (req, res) => {
    try {
      const serviceResponse = await StoreService.getStores(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getStoreByUser: async (req, res) => {
    try {
      const serviceResponse = await StoreService.getStoreByUser(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getStore: async (req, res) => {
    try {
      const serviceResponse = await StoreService.getStore(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getProducts: async (req, res) => {
    try {
      const serviceResponse = await StoreService.getProducts(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const serviceResponse = await StoreService.getProductById(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  createStore: async (req, res) => {
    try {
      const serviceResponse = await StoreService.createStore(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  patchStore: async (req, res) => {
    try {
      const serviceResponse = await StoreService.editStore(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  putStore: async (req, res) => {
    try {
      const serviceResponse = await StoreService.editStore(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  deleteStore: async (req, res) => {
    try {
      const serviceResponse = await StoreService.deleteStore(req);

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
}