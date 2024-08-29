const express = require("express");
const {
  Login,
  Register,
  RefreshToken,
  Me,
  Logout,
  SendEmail,
  ForgotPassword,
  GoogleLogin,
} = require("./auth.controller");
const {
  authentication,
  refreshToken,
} = require("../../middlewares/authentication.middleware");
const { RegisterMiddleware, LoginMiddleware, SendEmailMiddleware, ForgotPasswordMiddleware } = require("./auth.middleware");

const router = express.Router();

router.post('/auth/google', GoogleLogin);

// Login Reguler
router.post("/register", RegisterMiddleware, Register);
router.post("/login", LoginMiddleware, Login);
router.get("/me", authentication, Me);
router.post("/logout", Logout);

router.post("/send-email",SendEmailMiddleware, SendEmail)
router.post("/forgot-password/:token", ForgotPasswordMiddleware, ForgotPassword)

router.post("/refresh-token", refreshToken, RefreshToken);

module.exports = router;
