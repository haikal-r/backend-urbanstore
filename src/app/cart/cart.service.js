const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  badRequestResponse,
  notFoundResponse,
} = require("../../utils/apiResponse.utils");
const {
  findCartByUserId,
  insertCart,
  updateCartItem,
  findCartItemsById,
  deleteCartItem,
  insertCartItem,
  findCartItemsByCartId,
  findCarts,
  insertCartWithItem,
} = require("./cart.repository");
const {
  CartSummaryTransformer,
  CartQuantityTransformer,
} = require("../../helpers/cart.transformer");
const { ProductCartTransformer } = require("../../helpers/product.transformer");
const { orderItem } = require("../../db");

module.exports = {
  index: async () => {
    try {
      const cart = await findCarts();

      return apiResponse(status.OK, "OK", "Success add product to cart", cart);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getCart: async (req) => {
    try {
      const { user } = req;

      const carts = await findCartByUserId(user.id);
      const cartItems = carts[0].cartItems;

      const cartSummary = CartSummaryTransformer(cartItems);
      const cartProduct = cartItems.map((item) => ProductCartTransformer(item));


      const payload = {
        data: {
          cartSummary: cartSummary,
          cartItems: cartProduct,
        },
      };

      return apiResponse(status.OK, "OK", "Success fetch cart item", payload);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  createCartItem: async (req) => {
    try {
      const { user } = req;
      const { quantity, productId } = req.body;

      const carts = await findCartByUserId(user.id);
      const cartId = carts[0].id;
      const cartItems = carts[0].cartItems;

      const itemInCart = cartItems.find(
        (product) => productId === product.productId
      );
      if (itemInCart) throw badRequestResponse("Product Allready in cart");

      await insertCartItem({
        cartId: cartId,
        productId: productId,
        quantity: quantity,
      });

      return apiResponse(status.OK, "OK", "Success add product to cart");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  deleteCartItem: async (req) => {
    try {
      const { user } = req;
      const { productId } = req.body;
      console.log(req.body)
      console.log(productId)

      const cart = await findCartByUserId(user.id);
      if (!cart) throw badRequestResponse("User Not Found");

      const cartItems = cart.map((item) => item.cartItems);
      

      //* Delete 1 Product
      if (typeof productId === "number") {
        const product = cartItems[0].find(
          (item) => item.productId === productId
        );
        console.log(product)
        if (!product) throw badRequestResponse("Product Not Found");

        await deleteCartItem(product.id);
      } else {
        throw apiResponse(
          e.code || status.INTERNAL_SERVER_ERROR,
          e.status || "INTERNAL_SERVER_ERROR",
          e.message
        );
      }

      //* Delete 2+ Products
      if (Array.isArray(productId)) {
        const product = cartItems[0].map((item) =>
          productId.includes(item.productId) ? item.id : false
        );
        if (product === false) throw badRequestResponse("Product Not Found");
        const isProductInCart = product.some((item) => item === false);
        if (isProductInCart || product.length === 0)
          throw badRequestResponse("Product Not Found");

        await Promise.all(
          product.map(async (item) => await deleteCartItem(item))
        );
      } else {
        apiResponse(
          status.BAD_GATEWAY,
          "FAIL",
          "Failed Delete Array Product In Cart"
        );
      }

      return apiResponse(status.OK, "OK", "Success Delete product in cart");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  updateCartItem: async (req) => {
    try {
      const { productId, quantity } = req.body;
      const { user } = req;

      const carts = await findCartByUserId(user.id);
      const cartItems = carts[0].cartItems;

      const cartProduct = cartItems.map((cart) => ProductCartTransformer(cart));
      const product = cartProduct.find((item) => item.productId === productId);
      if (!product) throw badRequestResponse("Not Found Product");

      await updateCartItem(product.id, quantity);

      return apiResponse(status.OK, "OK", "Success Update quantity");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
