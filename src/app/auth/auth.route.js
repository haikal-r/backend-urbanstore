const express = require("express");
const {
  LoginByGoogle,
  LoginGoogleCallback,
  Login,
  Register,
  RefreshToken,
  Me,
  Logout,
  SendEmail,
  ForgotPassword,
} = require("./auth.controller");
const {
  authentication,
  refreshToken,
} = require("../../middlewares/authentication.middleware");
const { RegisterMiddleware, LoginMiddleware, SendEmailMiddleware, ForgotPasswordMiddleware } = require("./auth.middleware");

const router = express.Router();

// Login Google
router.get("/auth/google", LoginByGoogle);
router.get("/auth/google/callback", LoginGoogleCallback);

// Login Reguler
router.post("/register", RegisterMiddleware, Register);
router.post("/login", LoginMiddleware, Login);
router.get("/me", authentication, Me);
router.post("/logout", authentication, Logout);

router.post("/send-email",SendEmailMiddleware, SendEmail)
router.post("/forgot-password/:token", ForgotPasswordMiddleware, ForgotPassword)

router.get("/refresh-token", refreshToken, RefreshToken);

module.exports = router;
