const prisma = require("../../db");

const findProducts = async () => {
  const product = await prisma.product.findMany({
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

  return product;
};

const findCategories = async () => {
  const category = await prisma.category.findMany();

  return category;
};

const findProductsBySearch = async (query) => {
  const filteredProducts = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      uuid: true,
      name: true,
      slug: true,
      categoryId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const categories = await findCategories();
  const productByCategory = categories.map((category) => ({
    category: category.name,
    products: filteredProducts.filter(
      (product) => product.categoryId === category.id
    ),
  }));

  return productByCategory;
};

const findProductsByCategorySlug = async ({ slug, page, limit }) => {
  const totalData = await prisma.product.count();
  const totalPages = Math.ceil(totalData / limit);

  const lastVisiblePage = Math.min(totalPages, page + 9);
  const hasNextPage = page < totalPages;

  const offset = (page - 1) * limit;

  const data = await prisma.product.findMany({
    where: {
      Category: {
        slug: slug,
      },
    },
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
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
 
};

const findProductByProductUuid = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      uuid: productId,
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

  return product;
};

const insertProduct = async (payload) => {
  const product = await prisma.product.create({
    data: payload,
  });

  return product;
};

const insertCategory = async (data) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });
};

const deleteProduct = async (productId) => {
  return await prisma.product.delete({
    where: {
      productId,
    },
  });
};

const updateProduct = async (productId, stock) => {
  if (
    Array.isArray(productId) &&
    Array.isArray(stock) &&
    productId.length === stock.length
  ) {
    await Promise.all(
      productId.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { stock: stock[index] },
        })
      )
    );
  } else {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: stock
      },
    });
    return product;
  }
};

const editProduct = async (productId, productData) => {
  await prisma.product.update({
    where: {
      uuid: productId
    },
    data: productData
  })
}

const findProductsByLimit = async (page, limit) => {
  const totalData = await prisma.product.count();
  const totalPages = Math.ceil(totalData / limit);

  const lastVisiblePage = Math.min(totalPages, page + 9);
  const hasNextPage = page < totalPages;

  const offset = (page - 1) * limit;

  const data = await prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
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
};

module.exports = {
  findProducts,
  findProductsByLimit,
  findProductsBySearch,
  findCategories,
  insertProduct,
  insertCategory,
  findProductByProductUuid,
  findProductsByCategorySlug,
  deleteProduct,
  updateProduct,
  editProduct
};
