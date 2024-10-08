const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  notFoundResponse,
  badRequestResponse,
} = require("../../utils/apiResponse.utils");
const { hashPassword } = require("../../utils/bcrypt.utils");
const { exclude } = require("../../utils/excludeFields.utils");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt.utils");
const {
  findUserByEmail,
  findUserById,
  insertUser,
} = require("../user/user.repository");
const nodemailer = require("nodemailer");
const { insertCart } = require("../cart/cart.repository");
const {
  generateOAuthPassword,
  generateOAuthUsername,
} = require("../../helpers/oauth.helper");
const { google } = require("../../config/oauth.config");

module.exports = {
  register: async (payload) => {
    try {
      const { name, email, username, password, address } = payload;
      const hashedPassword = await hashPassword(password);

      const data = {
        name,
        username,
        email,
        address: address || null,
        password: hashedPassword,
      };

      const user = await insertUser(data);
      await insertCart(user.id);

      return apiResponse(status.OK, "OK", "Success Register", user);
    } catch (e) {
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  login: async (req) => {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const data = exclude(user, ["createdAt", "updatedAt"]);

      return apiResponse(status.OK, "OK", "Success Login", {
        data: data,
        accessToken,
        refreshToken,
      });
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  googleLogin: async (req) => {
    try {
      const { tokens } = await google.getToken(req.body.code);

      const ticket = await google.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const dataGoogle = ticket.getPayload();

      if (!dataGoogle.email || !dataGoogle.name)
        throw badRequestResponse("User not found");

      const user = await findUserByEmail(dataGoogle.email);
      if (!user) {
        const username = generateOAuthUsername(dataGoogle.name);
        const password = await generateOAuthPassword(dataGoogle.email);

        const newUser = await insertUser({
          name: dataGoogle.name,
          username,
          password,
          email: dataGoogle.email,
          picture: dataGoogle.picture,
        });
        const data = exclude(newUser, ["createdAt", "updatedAt"]);
        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken(data);

        await insertCart(newUser.id);

        return apiResponse(status.OK, "OK", "Success Login by Google", {
          data,
          accessToken,
          refreshToken,
        });
      }

      const data = exclude(user, ["createdAt", "updatedAt"]);
      const accessToken = generateAccessToken(data);
      const refreshToken = generateRefreshToken(data);

      return apiResponse(status.OK, "OK", "Success Login by Google", {
        data,
        accessToken,
        refreshToken,
      });
    } catch (e) {
      throw apiResponse({
        code: e.code || status.INTERNAL_SERVER_ERROR,
        status: e.status || "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  },
  refreshToken: async (req) => {
    try {
      const { email } = req.refreshToken;
      const user = await findUserByEmail(email);
      if (!user) throw notFoundResponse("User");

      const accessToken = generateAccessToken(user);

      return apiResponse(
        status.OK,
        "OK",
        "Success create new access token",
        accessToken
      );
    } catch (e) {
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  me: async (decoded) => {
    try {
      const { id } = decoded;
      const user = await findUserById(id);

      const data = exclude(user, ["createdAt", "updatedAt", "password"]);

      return apiResponse(
        status.OK,
        "OK",
        "Success get authenticate user",
        data
      );
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  sendEmail: async (req) => {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);
      const token = generateAccessToken({
        ...user,
      });

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Forgot Password",
        text: `${process.env.BASE_URL}/forgot-password/${token}`,
      });

      return apiResponse(status.OK, "OK", "Success Sending email");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  forgotPassword: async (req) => {
    try {
      const { password } = req.body;
      const { id } = req.user;

      const newPassword = await hashPassword(password);

      const payload = {
        password: newPassword,
      };

      await editUser(id, payload);

      return apiResponse(status.OK, "OK", "Success Create new password");
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
