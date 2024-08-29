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

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  getProductsBySearch: async (req, res) => {
    try {
      const serviceResponse = await getProductsBySearch(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const serviceResponse = await getAllCategories();

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  getProductByCategorySlug: async (req, res) => {
    try {
      const serviceResponse = await getProductsByCategorySlug(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
  getProductByProductId: async (req, res) => {
    try {
      const serviceResponse = await getProductByProductId(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  getProductByUUID: async (req, res) => {
    try {
      const serviceResponse = await getProductByUUID(req);

      return res.status(serviceResponse.code).json(serviceResponse);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  createProduct: async (req, res) => {
    try {
      const serviceResponse = await createProduct(req);

      return res.status(serviceResponse.code).json(serviceResponse.message);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  createCategory: async (req, res) => {
    try {
      const serviceResponse = await createCategory(req);

      return res.status(serviceResponse.code).json(serviceResponse.message);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const serviceResponse = await deleteProductById(req);

      return res.status(serviceResponse.code).json(serviceResponse.message);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  patchProduct: async (req, res) => {
    try {
      const serviceResponse = await editProductById(req);

      return res.status(serviceResponse.code).json(serviceResponse.message);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },

  putProduct: async (req, res) => {
    try {
      const serviceResponse = await editProductById(req);

      return res.status(serviceResponse.code).json(serviceResponse.message);
    } catch (e) {
      return res.status(e.code).json(e);
    }
  },
};
