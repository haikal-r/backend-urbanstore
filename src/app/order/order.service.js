const { StatusCodes: status } = require("http-status-codes");
const {
  getOrders,
  createOrder,
  createOrderItems,
  updateOrder,
  getOrderById,
  getAllOrders,
  getOrdersByStatus,
} = require("./order.repository");
const {
  apiResponse,
  notFoundResponse,
  badRequestResponse,
} = require("../../utils/apiResponse.utils");
const moment = require("moment");
const crypto = require("crypto");
const { findUserById, findUserByEmail } = require("../user/user.repository");
const {
  deleteCartItem,
  findCartByUserId,
  findCartItemsByCartId,
  updateCartItem,
} = require("../cart/cart.repository");
const { ProductCartTransformer } = require("../../helpers/product.transformer");
const { CartSummaryTransformer } = require("../../helpers/cart.transformer");
const { Snap } = require("../../config/midtrans.config");
const { generateOrderId } = require("../../utils/nanoid.utils");
const { updateProduct } = require("../product/product.repository");
const { OrderTransformer } = require("../../helpers/order.transformer");

module.exports = {
  createOrder: async (req) => {
    try {
      const { email } = req.user;
      const user = await findUserByEmail(email);

      const data = await findCartByUserId(user.id);
      const cartId = data.map((cart) => cart.id)[0];
      const carts = await findCartItemsByCartId(cartId);

      const cartSummary = CartSummaryTransformer(carts);
      const cartItems = carts.map((cart) => ProductCartTransformer(cart));

      if (carts.length === 0) throw badRequestResponse("No Cart Items");

      const order_id = await generateOrderId();
      const gross_amount = Math.round(cartSummary.sub_total.raw);

      const itemDetails = cartItems.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
        category: item.categoryId || "electronics",
        merchant_id: item.storeId,
      }));

      const parameter = {
        transaction_details: {
          order_id,
          gross_amount,
        },
        credit_card: {
          secure: true,
        },
        item_details: itemDetails,
        customer_details: {
          first_name: user.name,
          email: user.email,
        },
        callbacks: {
          finish: `${process.env.FRONT_END_URL}/dashboard/orders`,
          error: `${process.env.FRONT_END_URL}/dashboard/orders`,
          pending: `${process.env.FRONT_END_URL}/dashboard/orders`,
        },
      };

      const transaction = await Snap.createTransaction(parameter);

      await createOrder({
        id: order_id,
        token: transaction.token,
        totalPrice: cartSummary.sub_total.raw,
        User: {
          connect: {
            id: user.id,
          },
        },
      });

      const orderItemPayload = cartItems.map((item) => ({
        quantity: item.quantity,
        orderId: order_id,
        productId: item.productId,
        price: item.price,
        storeId: item.storeId,
      }));
      await createOrderItems(orderItemPayload);

      if (cartItems.length === 1) {
        const productId = cartItems[0].productId
        const productStock = cartItems[0].stock - cartItems[0].quantity;
        const cartItemId = cartItems[0].id

        await updateProduct(productId, productStock);
        await deleteCartItem(cartItemId);
      } else {
        const productIds = cartItems.map((item) => item.productId);
        const productStocks = cartItems.map(
          (item) => item.stock - item.quantity
        );
        const cartItemIds = cartItems.map(item => item.id)

        await updateProduct(productIds, productStocks);
        await deleteCartItem(cartItemIds);
      }

      return apiResponse(status.OK, "OK", "Success Create orders", {
        token: transaction.token,
      });
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getOrders: async (req) => {
    try {
      const { id } = req.user;
      const { status: statusOrder } = req.query;

      let orders;
      if (statusOrder) {
        orders = await getOrdersByStatus(id, statusOrder.toUpperCase());
      } else {
        orders = await getAllOrders(id);
      }

      const transformOrder = orders.map((order) => OrderTransformer(order));

      return apiResponse(
        status.OK,
        "OK",
        "Success fetch orders by status",
        transformOrder
      );
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  getOrder: async (req) => {
    try {
      const { id } = req.params;

      const url = `${process.env.MIDTRANS_API_URL}/v2/${id}/status`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Basic ${process.env.MIDTRANS_API_KEY}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      return apiResponse(status.OK, "OK", "Success fetch order by ID", data);
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  updateOrder: async (req) => {
    // Fetch order status
    const { id } = req.params;
    const url = `${process.env.MIDTRANS_API_URL}/v2/${id}/status`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization:
          "Basic U0ItTWlkLXNlcnZlci1WQ1V6dk5mUDV0Qmt3SFNDTFA2dnBRVUs=",
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    try {
      const { order_id, transaction_status, fraud_status } = data;
      switch (transaction_status) {
        case "pending":
          if (fraud_status === "accept") {
            await updateOrder(order_id, "PAID");
          }
          break;

        case "settlement":
          await updateOrder(order_id, "PAID");
          break;

        case "pending":
          await updateOrder(order_id, "PENDING");
          break;

        default:
          break;
      }

      if (
        transaction_status == "cancel" ||
        transaction_status == "deny" ||
        transaction_status == "expire"
      ) {
        const url = `${process.env.MIDTRANS_API_URL}/v2/${id}/cancel`;
        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            authorization:
              "Basic U0ItTWlkLXNlcnZlci1WQ1V6dk5mUDV0Qmt3SFNDTFA2dnBRVUs=",
          },
        };

        const response = await fetch(url, options);
        const data = response.json();
        await updateOrder(order_id, "CANCELED");

        return apiResponse({
          code: status.OK,
          message: "Success Delete Order",
        });
      }

      return apiResponse(status.OK, "OK", "Success Update Order");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
