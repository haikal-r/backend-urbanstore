const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  notFoundResponse,
  badRequestResponse,
} = require("../../utils/apiResponse.utils");
const { hashPassword } = require("../../utils/bcrypt.utils");
const { exclude } = require("../../utils/excludeFields.utils");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt.utils");
const { findUserByEmail, findUserById, insertUser } = require("../user/user.repository");
const { oauth2, oauth2Client } = require("../../config/google.config");
const nodemailer = require("nodemailer");

module.exports = {
  register: async (payload) => {
    try {
      const { name, email, password, address } = payload;
      const hashedPassword = await hashPassword(password);

      const data = {
        name,
        email,
        address,
        password: hashedPassword,
      };

      const user = await insertUser(data);

      return apiResponse(status.OK, 'OK', 'Success Register', user);
    } catch (e) {
      return apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || "INTERNAL_SERVER_ERROR", "Failed to create user");
    }
  },
  login: async (payload) => {
    try {
      const { email } = payload;
      const user = await findUserByEmail(email);
      
      const data = exclude(user, ["createdAt", "updatedAt"]);
      const accessToken = generateAccessToken(data);
      const refreshToken = generateRefreshToken(data);

      return apiResponse(status.OK, "OK", "Success login", {
        data,
        accessToken,
        refreshToken,
      });
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR,e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  },
  loginGoogleCallback: async (query) => {
    try {
      const { code } = query;
      const { tokens } = await oauth2Client.getToken(code);
  
      oauth2Client.setCredentials(tokens);
      const { data } = await oauth2.userinfo.get();
  
      if (!data.email || !data.name) throw badRequestResponse("User not found")
  
      let user = await findUserByEmail(data.email);
      if (!user) user = await insertUser(data);
      
      const payload = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        address: user?.address,
      };
  
      const token = generateAccessToken(payload);
  
      return apiResponse(status.OK, 'OK', 'Success Login by Google', { payload, token })
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  },
  refreshToken: async (refreshToken) => {
    try {
      const { id } = refreshToken;
      const user = await findUserById(id);
      if (!user) throw notFoundResponse("User");

      const accessToken = generateAccessToken(user);

      return apiResponse(status.OK, "OK", "Success create new access token", {
        accessToken,
      });
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR,e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  },
  me: async (decoded) => {
    try {
      const { id } = decoded;
      const user = await findUserById(id);

      const data = exclude(user, ["createdAt", "updatedAt", "password"]);

      return apiResponse(status.OK, "OK", "Success get authenticate user", {
        data,
      });
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR,e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  },
  sendEmail: async (payload) => {
    try {
      const { email } = payload;
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
  
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Forgot Password",
        text: `${process.env.BASE_URL}/forgot-password/${token}`,
      });
  
      return apiResponse(status.OK, 'OK', 'Success Sending email', info.messageId)
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR,e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  },
  forgotPassword: async (user, body) => {
    try {
      const { password } = body
      const { id } = user;
  
      const newPassword = await hashPassword(password)
  
      const payload = {
        password: newPassword,
      };
  
      const result = await editUser(id, payload)
  
      return apiResponse(status.OK, 'OK', 'Success Create new password', result)
    } catch (e) {
      throw apiResponse(e.code || status.INTERNAL_SERVER_ERROR,e.status || "INTERNAL_SERVER_ERROR", e.message);
    }
  }
};
