const { 
  findUsers,
  insertUser,
  findUserById,
  deleteUser,
  editUser,
  findUserByEmail,
} = require("./user.repository")

const getAllUsers = async () => {
  const users = await findUsers()

  return users
}

const getUserById = async (id) =>{
  const user = await findUserById(id)

  return user
}

const getUserByEmail = async (email) => {
  const user = await findUserByEmail(email)

  return user
}

const createUser = async (newUserData) => {
  const user = await insertUser(newUserData)

  return user
}

const deleteUserById = async (id) => {
  await getUserById(id)
  
  await deleteUser(id)
}

const editUserById = async (id, UserData) => {
  await findUserById(id)
  const user = await editUser(id, UserData)
  
  return user
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
}