const prisma = require("../../db");

module.exports = {
  findCarts: async () => {
    return await prisma.cart.findMany({
      include: {
        cartItems: {
          select: {
            product: true
          }
        }
      }
    });
  },
  findCartByUserId: async (userId) => {
    return await prisma.cart.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        cartItems: {
          include: {
            product: true
          }
        }
      },
    });
  },
  findCartItemsById: async (id) => {
    return await prisma.cartItem.findUnique({
      where: {
        id
      }
    })
  },
  findCartItemsByCartId: async (cartId) => {
    return await prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        product: true,
      },
    });
  },
  insertCart: async (userId) => {
    await prisma.cart.create({
      data: {
        userId: userId,
      }
    });
  },
  insertCartWithItem: async (userId, data) => {
    await prisma.cart.create({
      data: {
        userId: userId,
        cartItems: {
          createMany: {
            data: data 
          }
        }
      },
      include: {
        cartItems: true
      }
    });
  },
  insertCartItem: async (data) => {
    return await prisma.cartItem.create({
      data: {
        cartId: data.cartId,
        productId: data.productId,
        quantity: data.quantity || 1
      }
    })
  },
  updateCartItem: async (id, quantity) => {
    return await prisma.cartItem.update({
      where: {
        id
      },
      data: {
        quantity
      }
    })
  },
  findProduct: async (productId) => {
    return await prisma.cartItem.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
      }
    });
  },
  deleteCartItem: async (id) => {
    if (Array.isArray(id)) {
      await prisma.cartItem.deleteMany({
        where: {
          id: { in: id }
        }
      });
    } else {
      await prisma.cartItem.delete({
        where: {
          id: id
        }
      });
    }
  }
}
