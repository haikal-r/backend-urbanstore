const express = require("express");
const {
  LoginByGoogle,
  LoginGoogleCallback,
  Login,
  Register,
  RefreshToken,
  Me,
  Logout,
} = require("./auth.controller");

const router = express.Router();

// Login Google
router.get("/auth/google", LoginByGoogle);
router.get("/auth/google/callback", LoginGoogleCallback);

// Login Reguler
router.post("/register", Register);
router.post("/login", Login);
router.get("/refresh-token", RefreshToken);
router.post("/logout", Logout);
router.post("/me", Me);

module.exports = router;
