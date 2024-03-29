const { generateAccessToken } = require("../../utils/jwt.utils");
const { getUserByEmail, createUser } = require("../user/user.service");
const {
  noContentResponse,
  apiResponse,
} = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const AuthService = require("./auth.service");
const {
  authorizationUrl,
  oauth2,
  scopes,
  oauth2Client,
} = require("../../config/google.config");

const LoginByGoogle = (req, res) => {
  res.redirect(authorizationUrl);
};

const LoginGoogleCallback = async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const { data } = await oauth2.userinfo.get();

  if (!data.email || !data.name) {
    return res.json({
      data: data,
    });
  }

  let user = await getUserByEmail(data.email);

  if (!user) {
    user = await createUser(data);
  }

  const payload = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    address: user?.address,
  };

  const token = generateAccessToken(payload);

  // return res.redirect(`http://localhost:3000/auth-success?token=${token}`)

  return res.json({
    data: {
      id: user.id,
      name: user.name,
      email: user?.email,
      address: user.address,
    },
    token: token,
  });
};

const Login = async (req, res) => {
  try {
    const serviceResponse = await AuthService.login(req.body);
    res.cookie("refreshToken", serviceResponse.data.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
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

    return res
      .status(status.OK)
      .json(apiResponse(status.OK, "OK", "Logout Succesfully"));
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
};

const RefreshToken = async (req, res) => {
  try {
    const serviceResponse = await AuthService.refreshToken(req.body);
    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
};

const Me = async (req, res) => {
  try {
    const serviceResponse = await AuthService.me(req.body);
    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
};

module.exports = {
  LoginByGoogle,
  LoginGoogleCallback,
  Login,
  Register,
  RefreshToken,
  Me,
  Logout,
};
