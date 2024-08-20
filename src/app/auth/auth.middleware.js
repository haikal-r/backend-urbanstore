const {
  badRequestResponse,
  apiResponse,
} = require("../../utils/apiResponse.utils");
const { findUserByEmail, findUserById } = require("../user/user.repository");
const { StatusCodes: status } = require("http-status-codes");
const { comparePassword } = require("../../utils/bcrypt.utils");
const { verifyAccessToken } = require("../../utils/jwt.utils");

module.exports = {
  RegisterMiddleware: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);
      if (user) return res.status(status.BAD_REQUEST).json(badRequestResponse("Email already registered. Please use a different email."));

      next();
    } catch (e) {
      return res
      .status(e.code || status.INTERNAL_SERVER_ERROR)
      .json(
        apiResponse(
          e.code || status.INTERNAL_SERVER_ERROR,
          e.status || "INTERNAL_SERVER_ERROR",
          e.message
        )
      );
    }
  },
  LoginMiddleware: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await findUserByEmail(email);
      if (!user) return res.status(status.BAD_REQUEST).json(badRequestResponse("Invalid Email"));

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid)
        return res.json(badRequestResponse("Invalid Password"));

      next();
    } catch (e) {
      return res
        .status(e.code || status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
  SendEmailMiddleware: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await findUserByEmail(email);
      if (!user) return res.json(badRequestResponse("Email not registered"));

      next();
    } catch (e) {
      return res
        .status(e.code || status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
  ForgotPasswordMiddleware: async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body;
      if (password !== confirmPassword)
        return res.json(badRequestResponse("Password not match"));

      const token = req.params.token;
      if (!token) return res.json(badRequestResponse("Token not found"));

      const deCode = verifyAccessToken(token);
      const user = await findUserById(deCode.id);

      if (!user) return res.json(badRequestResponse("Email not registered"));

      req.user = user;
      next();
    } catch (e) {
      return res
        .status(e.code || status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
};
