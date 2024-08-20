const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  badRequestResponse,
  unAuthorizedResponse,
  notFoundResponse,
} = require("../../utils/apiResponse.utils");
const {
  findStores,
  insertStore,
  editStore,
  deleteStore,
  findStoreBySlug,
  findProducts,
  findStoreByUser,
} = require("./store.repository");
const slugify = require("slugify");
const { findProductById } = require("../product/product.repository");
const { ProductTransformer } = require("../../helpers/product.transformer");

module.exports = {
  getStores: async (req) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      const getStores = await findStores(page, limit);
      const { data, pagination } = getStores;

      return apiResponse(status.OK, "OK", "Success fetch stores", {
        pagination,
        data,
      });
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getStoreByUser: async (req) => {
    try {
      const { id } = req.user;

      const store = await findStoreByUser(id);
      if (!store) notFoundResponse("No store found!");

      return apiResponse(status.OK, "OK", "Success Fetching", store);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getStore: async (req) => {
    try {
      const { slug } = req.params;

      const store = await findStoreBySlug(slug);
      if (!store) throw badRequestResponse("No Store Found");

      return apiResponse(
        status.OK,
        "OK",
        "Success Fetching store by Slug",
        store
      );
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getProducts: async (req) => {
    try {
      const { slug } = req.params;
      console.log(slug);
      const store = await findStoreBySlug(slug);
      if (!store) throw badRequestResponse("No Store Found");

      const data = await findProducts(store.id);
      const products = data.map((product) => ProductTransformer(product));

      return apiResponse(
        status.OK,
        "OK",
        "Success Fetching Products by Store",
        products
      );
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
  getProductById: async (req) => {
    try {
      const { slug, productId } = req.params;
      const store = await findStoreBySlug(slug);
      if (!store) throw badRequestResponse("No Store Found");

      const products = await findProductById(productId);
      if (!products) throw badRequestResponse("No Product Found");

      return apiResponse(
        status.OK,
        "OK",
        "Success Fetching Product by Id",
        products
      );
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
  createStore: async (req) => {
    try {
      const { name, description } = req.body;
      const { user } = req;

      const payload = {
        name,
        slug: slugify(name).toLowerCase(),
        description,
        userId: user.id,
      };
      const store = await insertStore(payload);

      return apiResponse(status.OK, "OK", "Success Creating", store);
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
  editStore: async (req) => {
    try {
      const { slug } = req.params;
      const { name, description } = req.body;
      const { user } = req;

      if (!user) throw unAuthorizedResponse("User no found!!!");

      const payload = {
        name,
        slug: slugify(name).toLowerCase(),
        description,
      };
      const store = await editStore(slug, payload);

      return apiResponse(status.OK, "OK", "Success Editing", store);
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
  deleteStore: async (req) => {
    try {
      const { slug } = req.params;
      await deleteStore(slug);

      return apiResponse(status.OK, "OK", "Success Deleting");
    } catch (e) {
      return apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
};
