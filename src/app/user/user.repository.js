const prisma = require("../../db");

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
    }
  });

  return user;
};

const findUserByEmailWithCart = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      carts: {
        include: {
          cartItems: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  return user;
};

const insertUser = async (newUserData) => {
  const user = await prisma.user.create({
    data: {
      name: newUserData.name || "",
      username: newUserData.username || "",
      email: newUserData.email,
      picture: newUserData.picture,
      address: newUserData.address || null,
      password: newUserData.password || "",
    },
    
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

const editUser = async (id, data) => {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: data.name ,
      email: data.email ,
      address: data.address ,
      password: data.password ,
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
  findUserByEmailWithCart
};
