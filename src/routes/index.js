const authRoute = require("../app/auth/auth.route.js");
const userRoute = require("../app/user/user.controller");
const productRoute = require("../app/product/product.route");
const storeRoute = require("../app/store/store.route.js")
const cartRoute = require("../app/cart/cart.route.js")
const orderRoute = require("../app/order/order.route")

const routes = (app) => {
  const version = process.env.API_VERSION || "v1"
  const apiVersion = `/api/${version}`
  
  app.use(`/`, authRoute);
  app.use(`${apiVersion}/products`, productRoute);
  app.use(`${apiVersion}/users`, userRoute);
  app.use(`${apiVersion}/stores`, storeRoute);
  app.use(`${apiVersion}/carts`, cartRoute)
  app.use(`${apiVersion}/orders`, orderRoute)
};

module.exports = {
  routes
};
