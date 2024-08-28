const {
  noContentResponse,
  apiResponse,
} = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const AuthService = require("./auth.service");

const GoogleLogin = async (req, res) => {
  try {
    const serviceResponse = await AuthService.googleLogin(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};


const Login = async (req, res) => {
  try {
    const serviceResponse = await AuthService.login(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const Register = async (req, res) => {
  try {
    const serviceResponse = await AuthService.register(req.body);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
};

const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw noContentResponse("No Refresh token Provided");

    return res.status(status.OK).json(
      apiResponse({
        code: status.OK,
        message: "Logout Succesfully",
      })
    );
  } catch (e) {
    return res.status(e.code).json(e);
  }
};

const RefreshToken = async (req, res) => {
  try {
    const serviceResponse = await AuthService.refreshToken(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const Me = async (req, res) => {
  try {
    const serviceResponse = await AuthService.me(req.user);
    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const SendEmail = async (req, res) => {
  try {
    const serviceResponse = await AuthService.sendEmail(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const serviceResponse = await AuthService.forgotPassword(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

module.exports = {
  GoogleLogin,
  Login,
  Register,
  RefreshToken,
  SendEmail,
  ForgotPassword,
  Me,
  Logout,
};
