const express = require("express");
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  editUserById,
} = require("./user.service");
const { apiResponse } = require("../../utils/apiResponse.utils");
const { StatusCodes: status } = require("http-status-codes");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const serviceResponse = await getAllUsers();

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
  );
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await getUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
  );
  }
});

router.post("/", async (req, res) => {
  try {
    const serviceResponse = await createUser(req.body);

    return res.status(serviceResponse.code).json(serviceResponse);
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
  );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const serviceResponse = await deleteUserById(parseInt(userId));

    return res.status(serviceResponse.code).json(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
  );
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const serviceResponse = await editUserById(parseInt(userId), userData);

    return res.status(serviceResponse.status).json(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const serviceResponse = await editUserById(parseInt(userId), userData);
  
    return res.status(serviceResponse.status).json(serviceResponse)
  } catch (e) {
    return res.status(e.code || status.INTERNAL_SERVER_ERROR).json(
      apiResponse(e.code || status.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message),
    )
  }
});

module.exports = router;
