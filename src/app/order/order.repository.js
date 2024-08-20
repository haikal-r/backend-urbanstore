const prisma = require("../../db");

module.exports = {
  getAllOrders: async (userId) => {
    return await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        User: {
          select: {
            email: true,
            address: true,
            name: true
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                Store: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              },
            },
          },
        },
      },
    });
  },
  getOrdersByStatus: async (userId, status) => {
    return await prisma.order.findMany({
      where: {
        userId,
        status,
      },
      include: {
        User: {
          select: {
            email: true,
            address: true,
            name: true
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                Store: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              },
            },
          },
        },
      },
    });
  },
  getOrderById: async (id) => {
    return await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });
  },
  createOrder: async (payload) => {
    return await prisma.order.create({
      data: payload,
    });
  },
  createOrderItems: async (data) => {
    return await prisma.orderItem.createMany({
      data: data.map((product) => ({
        price: product.price,
        quantity: product.quantity,
        orderId: product.orderId,
        productId: product.productId,
        storeId: product.storeId
      })),
    });
  },
  updateOrder: async (id, status) => {
    return await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  },
};
