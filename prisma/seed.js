// seed.ts

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  await prisma.category.createMany({
    data: [
      {
        name: 'Clothing',
        slug: 'clothing'
      },
      {
        name: 'Electronics',
        slug: 'electronics'
      }
    ]
  });

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "john doe",
        username: "john_doe",
        email: "john_doe@example.com",
        password: "123456",
        address: "123 Main St",
      },
      {
        id: 2,
        name: "jane doe",
        username: "jane_doe",
        email: "jane_doe@example.com",
        password: "123456",
        address: "456 Elm St",
      },
    ],
    skipDuplicates: true,
  });

  const userJhon = await prisma.user.findUnique({
    where: { email: "john_doe@example.com" },
  });

  await prisma.store.create({
    data: {
      id: 1,
      name: "Jhon Store",
      slug: "jhon-store",
      description: "Toko terbaik sepanjang masa",
      userId: userJhon.id,
    },
  });

  const storeJhon = await prisma.store.findUnique({
    where: { slug: "jhon-store" },
  });

  const electronicsCategory = await prisma.category.findUnique({
    where: { name: 'Electronics' }
  })

  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: "Product 1",
        slug: "product-1",
        description: "Description for product 1",
        price: 20000,
        stock: 20,
        images: [],
        storeId: storeJhon.id,
        categoryId: electronicsCategory.id
      },
      {
        id: 2,
        name: "Product 2",
        slug: "product-2",
        description: "Description for product 2",
        price: 30000,
        stock: 26,
        images: [],
        storeId: storeJhon.id,
        categoryId: electronicsCategory.id
      },
    ],
    skipDuplicates: true,
  });

  // Add more seeding logic as needed
}

main()
  .catch((e) => {
    throw e
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
