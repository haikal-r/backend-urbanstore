const prisma = require("../../db");

module.exports = {
  findStores: async (page, limit) => {
    const totalData = await prisma.store.count();
    const totalPages = Math.ceil(totalData / limit);

    const lastVisiblePage = Math.min(totalPages, page + 9);
    const hasNextPage = page < totalPages;

    const offset = (page - 1) * limit;

    const data = await prisma.store.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const pagination = {
      lastVisiblePage: lastVisiblePage,
      hasNextPage: hasNextPage,
      currentPage: page,
      items: {
        count: data.length,
        total: totalData,
        perPage: limit,
      },
    };

    return { pagination, data };
  },
  findStoreByUser: async (userId) => {
    return await prisma.store.findMany({
      where: {
        userId: userId,
      },
    });
  },
  findStoreBySlug: async (slug) => {
    return await prisma.store.findUnique({
      where: {
        slug,
      },
    });
  },
  findProducts: async (storeId) => {
    return await prisma.product.findMany({
      where: { 
        storeId: storeId
      },
      include: {
        Category: {
          select: {
            name: true,
          },
        },
        Store: {
          select: {
            name: true,
          },
        },
      },
    });
  },
  insertStore: async (payload) => {
    return await prisma.store.create({
      data: payload,
    });
  },
  editStore: async (slug, payload) => {
    return await prisma.store.update({
      where: {
        slug,
      },
      data: payload,
    });
  },
  deleteStore: async (slug) => {
    return await prisma.store.delete({
      where: {
        slug,
      },
    });
  },
};
