const authRoute = require("../app/auth/auth.route.js");
const userRoute = require("../app/user/user.controller");
const productRoute = require("../app/product/product.controller");
const { accessValidation } = require("../app/auth/auth.middleware");

const routes = (app) => {
  const apiVersion = process.env.API_VERSION || "v1";
  const preRoutes = `/api`;

  app.use(`/`, authRoute);
  app.use(`${preRoutes}/products`, productRoute);
  app.use(`${preRoutes}/users`, userRoute);
};

module.exports = {
  routes
};
