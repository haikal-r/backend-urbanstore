const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (payload) => {
    const { id, name } = payload;
    return jwt.sign({ id, name }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' });
},

  generateRefreshToken: (payload) => {
    const { id, name } = payload;
    return jwt.sign({ id, name }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });
},

verifyAccessToken: (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY),
verifyRefreshToken: (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY),
};
