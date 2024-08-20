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
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await UserService.getUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const serviceResponse = await UserService.createUser(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await UserService.deleteUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const serviceResponse = await UserService.editUserById(req);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR",
      message: e.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const serviceResponse = await UserService.editUserById(req);

    return res.status(serviceResponse.code).json(serviceResponse);
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
});

module.exports = router;
