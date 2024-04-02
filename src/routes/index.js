const authRoute = require("../app/auth/auth.route.js");
const userRoute = require("../app/user/user.controller");
const productRoute = require("../app/product/product.controller");
const { accessValidation } = require("../app/auth/auth.middleware");

const routes = (app) => {

  app.use(`/`, authRoute);
  app.use(`/products`, productRoute);
  app.use(`/users`, userRoute);
};

module.exports = {
  routes
};
