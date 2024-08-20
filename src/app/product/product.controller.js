const { StatusCodes: status }  = require("http-status-codes")
const {
  getAllProducts,
  getAllCategories,
  getProductsBySearch,
  createProduct,
  getProductsByCategorySlug,
  deleteProductById,
  editProductById,
  createCategory,
  getProductByProductId,
} = require("./product.service");
const { apiResponse } = require("../../utils/apiResponse.utils");


module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const serviceResponse = await getAllProducts(req);
  
      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getProductsBySearch: async (req, res) => {
    try {
      const serviceResponse = await getProductsBySearch(req);
  
      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const serviceResponse = await getAllCategories()

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getProductByCategorySlug: async (req, res) => {
    try {
      const serviceResponse = await getProductsByCategorySlug(req)

      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  getProductByProductId: async (req, res) => {
    try {
      const serviceResponse = await getProductByProductId(req);
  
      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },

  getProductByUUID: async (req, res) => {
    try {
      const serviceResponse = await getProductByUUID(req);
  
      return res.status(serviceResponse.code).json(serviceResponse)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  
  createProduct: async (req, res) => {
    try {    
      const serviceResponse = await createProduct(req);
  
      return res.status(serviceResponse.code).json(serviceResponse.message)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  
  createCategory: async (req, res) => {
    try {
      const serviceResponse = await createCategory(req)

      return res.status(serviceResponse.code).json(serviceResponse.message)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const serviceResponse = await deleteProductById(req);
  
      return res.status(serviceResponse.code).json(serviceResponse.message)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  
  patchProduct: async (req, res) => {
    try {
      const serviceResponse = await editProductById(req);
  
      return res.status(serviceResponse.code).json(serviceResponse.message)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  },
  
  putProduct: async (req, res) => {
    try {
      const serviceResponse = await editProductById(req);
  
      return res.status(serviceResponse.code).json(serviceResponse.message)
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR", 
        message: e.message
      });
    }
  }
}





