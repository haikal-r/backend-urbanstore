const { unAuthorizedResponse, noContentResponse } = require("../utils/apiResponse.utils");
const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwt.utils");

const tokenErr = (e) => {
  if (e.name === "TokenExpiredError") {
    return unAuthorizedResponse("Token Expired. Please login again.");
  }
  if (e.name === "JsonWebTokenError") {
    return unAuthorizedResponse("Invalid Token.");
  }
};

module.exports = {
  authentication: (req, res, next) => {
    try {
      const bearer = req.headers.authorization;
      if (!bearer) throw unAuthorizedResponse();

      const token = bearer.split(" ")[1];
      req.user = verifyAccessToken(token);

      next();
    } catch (e) {
      const err = tokenErr(e);
      if (err) return res.status(err.code).json(err);
      return res.status(e.code).json(e);
    }
  },
  refreshToken: (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw noContentResponse("No Refresh Token Provided");

      req.refreshToken = verifyRefreshToken(refreshToken);
      
      next();
    } catch (e) {
      const err = tokenErr(e);
      if (err) return res.status(err.code).json(err);
      return res.status(e.code).json(e);
    }
  },
  optionalAuthentication: (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) throw unAuthorizedResponse();

        const token = bearer.split(' ')[1];
        if (!token) throw unAuthorizedResponse();

        req.user = verifyAccessToken(token);

        next();
    } catch (e) {
        req.user = null;
        next();
    }
},
};
