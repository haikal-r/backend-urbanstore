const {
  insertProduct,
  deleteProduct,
  insertCategory,
  findCategories,
  findProductsByCategorySlug,
  findProductsByLimit,
  findProductsBySearch,
  findProductByProductUuid,
  editProduct,
} = require("./product.repository");
const {
  apiResponse,
  badRequestResponse,
} = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const slugify = require("slugify");
const { findStoreBySlug } = require("../store/store.repository");
const { ProductTransformer } = require("../../helpers/product.transformer");
const axios = require("axios");
const FormData = require("form-data");

const getAllProducts = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const getProducts = await findProductsByLimit(page, limit);
    const { data, pagination } = getProducts;
    const products = data.map((product) => ProductTransformer(product));

    return apiResponse(status.OK, "OK", "Success fetch products", {
      pagination,
      data: products,
    });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const getProductsBySearch = async (req) => {
  try {
    const { query } = req.query;

    const products = await findProductsBySearch(query);

    return apiResponse(status.OK, "OK", "Success fetching product", products);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const getAllCategories = async () => {
  try {
    const categories = await findCategories();

    return apiResponse(
      status.OK,
      "OK",
      "Success fetch all categories",
      categories
    );
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const getProductsByCategorySlug = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const { slug } = req.params;

    const getProducts = await findProductsByCategorySlug({ slug, page, limit });
    const { data, pagination } = getProducts;
    const products = data.map((product) => ProductTransformer(product));

    return apiResponse(status.OK, "OK", "Success fetch products", {
      pagination,
      data: products,
    });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const getProductByProductId = async (req) => {
  try {
    const { productId } = req.params;

    const data = await findProductByProductUuid(productId);
    if (!data) throw badRequestResponse("No Data");

    const product = ProductTransformer(data);

    return apiResponse(status.OK, "OK", "Success fetch product by id", product);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const createProduct = async (req) => {
  try {
    const { slug } = req.params;
    const { user } = req;
    const { name, price, description, stock, category } = req.body;

    if (!user) throw badRequestResponse("Please sign in");

    const store = await findStoreBySlug(slug);
    if (!store) throw badRequestResponse("Store not found");

    if (!req.files || req.files.length === 0) {
      return badRequestResponse("No files uploaded");
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const formData = new FormData();
      formData.append("image", file.buffer, file.originalname);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "32121eac2d5fc26e6b4fc66c9b38eff6",
          },
          headers: formData.getHeaders(),
        }
      );

      uploadedUrls.push(response.data.data.url);
    }

    const payload = {
      Store: {
        connect: {
          id: store.id,
        },
      },
      Category: {
        connect: {
          name: category,
        },
      },
      name,
      slug: slugify(name),
      price: parseInt(price),
      description,
      stock: parseInt(stock),
      images: uploadedUrls,
    };
    await insertProduct(payload);

    return apiResponse(status.OK, "OK", "Success Creating Product");
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const createCategory = async (req) => {
  try {
    const { name } = req.body;
    const payload = {
      name: name,
      slug: slugify(name).toLowerCase(),
    };

    await insertCategory(payload);

    return apiResponse(status.OK, "OK", "Success Creating Category");
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Some fields are missing"
    );
  }
};

const editProductById = async (req) => {
  try {
    const { productId } = req.params;
    const productData = req.body;
    await editProduct(productId, productData);

    return apiResponse(status.OK, "OK", "Success Edit Product By Id");
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Some fields are missing"
    );
  }
};

const deleteProductById = async (req) => {
  try {
    const { productId } = req.params;
    await deleteProduct(productId);

    return apiResponse(status.OK, "OK", "Success Delete Product");
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

module.exports = {
  getAllProducts,
  getAllCategories,
  getProductsBySearch,
  getProductByProductId,
  getProductsByCategorySlug,
  createProduct,
  createCategory,
  editProductById,
  deleteProductById,
};
