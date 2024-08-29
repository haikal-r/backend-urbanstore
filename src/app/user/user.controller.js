const express = require("express");
const { apiResponse } = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");
const UserService = require("./user.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const serviceResponse = await UserService.getAllUsers();

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await UserService.getUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const serviceResponse = await UserService.createUser(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await UserService.deleteUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const serviceResponse = await UserService.editUserById(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const serviceResponse = await UserService.editUserById(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code).json(e);
  }
});

module.exports = router;
