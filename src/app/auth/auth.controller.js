const {
  noContentResponse,
  apiResponse
} = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const AuthService = require("./auth.service");
const { authorizationUrl } = require("../../config/google.config");

const LoginByGoogle = (req, res) => {
  try {
    return res.redirect(authorizationUrl);

  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const LoginGoogleCallback = async (req, res) => {
  try {
    const serviceResponse = await AuthService.loginGoogleCallback(req.query)
    // * Integrated with frontend
    // if (serviceResponse.code !== 200) return res.status(serviceResponse.code).json(serviceResponse)
    // const token = await serviceResponse.data.token
    // return res.redirect(`${process.env.BASE_URL}/auth-success?token=${token}`)
    
    return res.status(serviceResponse.code).json(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const Login = async (req, res) => {
  try {
    const serviceResponse = await AuthService.login(req.body);
    if (serviceResponse.code !== 200) return res.status(serviceResponse.code).json(serviceResponse)

    res.cookie("refreshToken", serviceResponse.data.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
  });

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const Register = async (req, res) => {
  try {
    const serviceResponse = await AuthService.register(req.body);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw noContentResponse("No Refresh token Provided");

    res.clearCookie("refreshToken");

    return res.status(status.OK).json(apiResponse(status.OK, "OK", "Logout Succesfully"));
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const RefreshToken = async (req, res) => {
  try {
    const serviceResponse = await AuthService.refreshToken(req.refreshToken);
    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const Me = async (req, res) => {
  try {
    const serviceResponse = await AuthService.me(req.user);
    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
};

const SendEmail = async (req, res) => {
  try {
    const serviceResponse = await AuthService.sendEmail(req.body)

    return res.status(serviceResponse.code).josn(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
}

const ForgotPassword = async (req, res) => {
  try {
    const serviceResponse = await AuthService.forgotPassword(req.user, req.body)

    return res.status(serviceResponse.code).json(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
}

module.exports = {
  LoginByGoogle,
  LoginGoogleCallback,
  Login,
  Register,
  RefreshToken,
  SendEmail,
  ForgotPassword,
  Me,
  Logout,
}
