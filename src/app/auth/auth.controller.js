const {
  noContentResponse,
  apiResponse,
} = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const AuthService = require("./auth.service");
const { authorizationUrl } = require("../../config/google.config");
const { OAuth2Client } = require("google-auth-library");
const {
  BASE_URL,
  API_VERSION,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("../../constants/config");

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

const LoginByGoogle = (req, res) => {
  try {
    const oAuth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${BASE_URL}/auth/google/callback`
    );

    // Generate the url that will be used for the consent dialog.
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const authorizationUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
    });

    // res.json({ url: authorizationUrl })
    res.redirect(authorizationUrl);
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const LoginGoogleCallback = async (req, res) => {
  try {
    const serviceResponse = await AuthService.loginGoogleCallback(req);
    // * Integrated with frontend
    if (serviceResponse.code !== 200)
      return res.status(serviceResponse.code).json(serviceResponse);

    res.cookie("accessToken", serviceResponse.data.accessToken, {
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
      secure: true, 
      path: '/',
      domain: process.env.FRONT_END_URL
    });

    res.cookie("refreshToken", serviceResponse.data.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    return res.redirect(`${process.env.FRONT_END_URL}`);
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
    if (serviceResponse.code !== 200)
      return res.status(serviceResponse.code).json(serviceResponse);

    res.cookie("accessToken", serviceResponse.data.accessToken, {
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
      secure: true, 
      path: '/',
      domain: process.env.FRONT_END_URL
    });

    res.cookie("refreshToken", serviceResponse.data.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: '/',
      domain: process.env.BASE_URL
    });

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

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(status.OK).json(
      apiResponse({
        code: status.OK,
        message: "Logout Succesfully",
      })
    );
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      e.message
    );
  }
};

const RefreshToken = async (req, res) => {
  try {
    const serviceResponse = await AuthService.refreshToken(req);

    res.cookie("accessToken", serviceResponse.data, {
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
      secure: true, 
      path: '/',
      domain: process.env.FRONT_END_URL
    });

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
  LoginByGoogle,
  LoginGoogleCallback,
  GoogleLogin,
  Login,
  Register,
  RefreshToken,
  SendEmail,
  ForgotPassword,
  Me,
  Logout,
};
