const { StatusCodes: status } = require("http-status-codes");
const {
  findUsers,
  insertUser,
  findUserById,
  deleteUser,
  editUser,
  findUserByEmail,
} = require("./user.repository");
const { apiResponse, badRequestResponse } = require("../../utils/apiResponse.utils");
const { hashPassword } = require("../../utils/bcrypt.utils");

const getAllUsers = async () => {
  try {
    const users = await findUsers();

    return apiResponse(status.OK, 'OK', 'Success fetch user', users);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

const getUserById = async (id) => {
  try {
    const user = await findUserById(id);
    if (!user) throw badRequestResponse("No data")

    return apiResponse(status.OK, 'OK', 'Success fetching', user);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await findUserByEmail(email);
    if(!user) badRequestResponse("Email is undefined")

    return apiResponse(status.OK, 'OK', 'Success fetching', user);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

const createUser = async (req) => {
  try {
    const { name, email, address, password } = req.body
    const { id } = req.params

    const payload = {
      name,
      email,
      address,
      password: await hashPassword(password)
    }

    const user = await insertUser(parseInt(id), payload);

    return apiResponse(status.OK, 'OK', 'Success Creating', user);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await deleteUser(id);

    return apiResponse(status.OK, 'OK', 'Success Deleting', user);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

const editUserById = async (req) => {
  try {
    const { id } = req.params
    const { name, email, address, password } = req.body

    const payload = {
      name,
      email,
      address,
      password: await hashPassword(password)
    }

    const user = await editUser(parseInt(id), payload);

    return apiResponse(status.OK, 'OK', 'Success Editing', user);
  } catch (e) {
    return apiResponse({
      code: e.code || status.INTERNAL_SERVER_ERROR,
      status: e.status || "INTERNAL_SERVER_ERROR", 
      message: e.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
};
