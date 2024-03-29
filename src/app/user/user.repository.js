const prisma = require("../../db");
const { exclude } = require("../../utils/excludeFields.utils");

const findUsers = async () => {
  const user = await prisma.user.findMany();

  return user;
};

const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

const insertUser = async (newUserData) => {
  const user = await prisma.user.create({
    data: newUserData,
  });

  return user;
};

const deleteUser = async (id) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};

const editUser = async (id, UserData) => {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      title: UserData.title,
      description: UserData.description,
      image: UserData.image,
      price: UserData.price,
    },
  });

  return user;
};

module.exports = {
  findUsers,
  findUserByEmail,
  insertUser,
  findUserById,
  deleteUser,
  editUser,
};
