const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  badRequestResponse,
  notFoundResponse,
} = require("../../utils/apiResponse.utils");
const { hashPassword, comparePassword } = require("../../utils/bcrypt.utils");
const { createUser, getUserById, getUserByEmail } = require("../user/user.service");
const { exclude } = require("../../utils/excludeFields.utils")
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt.utils");

module.exports = {
  register: async (payload) => {
    try {
      const { name, username, email, password } = payload;
      const hashedPassword = await hashPassword(password);

      const data = {
        name,
        username,
        email,
        password: hashedPassword,
      };

      const user = await createUser(data);

      return apiResponse(
        status.CREATED,
        "CREATED",
        "Success create a new account",
        { user }
      );
    } catch (e) {
      return apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
  login: async (payload) => {
    try {
      const { email, password } = payload;
      const user = await getUserByEmail(email);
      const data = exclude(user, ["createdAt", "updatedAt"]);

      if (!user) throw badRequestResponse("Akun anda tidak ditemukan");
      if (!(await comparePassword(password, user.password)))
        throw badRequestResponse("Password Salah");

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return apiResponse(status.OK, "OK", "Success login", {
        data,
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
  refreshToken: async (refreshToken) => {
    try {
      const { id } = refreshToken;
      const user = await getUserById(id);
      if (!user) throw notFoundResponse("User");

      const accessToken = generateAccessToken(user);

      return apiResponse(status.OK, "OK", "Success create new access token", {
        accessToken,
      });
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
      const { id } = decoded
      const user = await getUserById(id);
    
      const data = exclude(user, ["createdAt", "updatedAt", "password"]);
    
      return apiResponse(status.OK, 'OK', 'Success get authenticate user', { data })
    } catch (e) {
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  }
};
