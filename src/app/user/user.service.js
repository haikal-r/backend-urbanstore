const {
  findUsers,
  insertUser,
  findUserById,
  deleteUser,
  editUser,
  findUserByEmail,
} = require("./user.repository");
const { StatusCodes: status } = require("http-status-codes");
const { apiResponse, apiResponseValidationError, badRequestResponse } = require("../../utils/apiResponse.utils");

const getAllUsers = async () => {
  try {
    const users = await findUsers();

    return apiResponse(status.OK, 'OK', 'Success fetch user', { users });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Failed to fetch user"
    );
  }
};

const getUserById = async (id) => {
  try {
    const user = await findUserById(id);
    if(!user) throw badRequestResponse("ID is undefined")

    return apiResponse(status.OK, 'OK', 'Success fetching', { user });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Resource does not exist"
    );
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await findUserByEmail(email);
    if(!user) badRequestResponse("Email is undefined")

    return apiResponse(status.OK, 'OK', 'Success fetching', { user });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Failed to fetch user"
    );
  }
};

const createUser = async (newUserData) => {
  try {
    const user = await insertUser(newUserData);

    return apiResponse(status.CREATED,  "CREATED", "Success create a new account", { user }
    );
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Some field are missing !!!"
    );
  }
};

const deleteUserById = async (id) => {
  try {
    const user = await deleteUser(id);

    return apiResponse(status.OK, 'OK', 'Success Deleting', { user });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Failed to delete user"
    );
  }
};

const editUserById = async (id, UserData) => {
  try {
    const user = await editUser(id, UserData);

    return apiResponse(status.OK, 'OK', 'Success Editing', { user });
  } catch (e) {
    return apiResponse(
      e.code || status.INTERNAL_SERVER_ERROR,
      e.status || "INTERNAL_SERVER_ERROR",
      "Failed to Editing user"
    );
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
