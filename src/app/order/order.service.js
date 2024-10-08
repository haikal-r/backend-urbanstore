const { StatusCodes: status } = require("http-status-codes");
const {
  createOrder,
  createOrderItems,
  updateOrder,
  getAllOrders,
  getOrdersByStatus,
} = require("./order.repository");
const {
  apiResponse,
  badRequestResponse,
} = require("../../utils/apiResponse.utils");
const { findUserByEmailWithCart, findUserByEmail } = require("../user/user.repository");
const { deleteCartItem } = require("../cart/cart.repository");
const { Snap } = require("../../config/midtrans.config");
const { generateOrderId } = require("../../utils/nanoid.utils");
const { updateProduct } = require("../product/product.repository");
const { OrderTransformer } = require("../../helpers/order.transformer");

module.exports = {
  createOrder: async (req) => {
    try {
      const { email } = req.user;
      const user = await findUserByEmailWithCart(email);

      const cartItems = user.carts.flatMap((cart) => cart.cartItems);
      if (cartItems.length === 0) throw badRequestResponse("No Cart Items");

      const grossAmount = cartItems.reduce((acc, item) => {
        return acc + item.quantity * parseFloat(item.product.price);
      }, 0);

      const orderId = await generateOrderId();

      const itemDetails = cartItems.map((item) => ({
        id: item.product.id,
        price: Number(item.product.price),
        quantity: item.quantity,
        name: item.product.name,
        category: item.product.categoryId,
        merchant_id: item.product.storeId,
      }));

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(grossAmount),
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
        id: orderId,
        token: transaction.token,
        totalPrice: grossAmount,
        User: {
          connect: {
            id: user.id,
          },
        },
      });

      const orderItemPayload = cartItems.map((item) => ({
        quantity: item.quantity,
        orderId: orderId,
        productId: item.product.id,
        price: item.product.price,
        storeId: item.product.storeId,
      }));
      await createOrderItems(orderItemPayload);

      const productUpdatePromises = cartItems.map((item) => 
        updateProduct(item.product.id, item.product.stock - item.quantity)
      );
      await Promise.all(productUpdatePromises);
  
      const cartItemDeletePromises = cartItems.map((item) => 
        deleteCartItem(item.id)
      );
      await Promise.all(cartItemDeletePromises);

      return apiResponse(status.OK, "OK", "Success Create orders", {
        token: transaction.token,
      });
    } catch (e) {
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message || "Could not checkout, please try again later."
      );
    }
  },
  getOrders: async (req) => {
    try {
      const { email } = req.user;
      const { status: statusOrder } = req.query;

      const user  = await findUserByEmail(email)

      let orders;
      if (statusOrder) {
        orders = await getOrdersByStatus(user.id, statusOrder.toUpperCase());
      } else {
        orders = await getAllOrders(user.id);
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
