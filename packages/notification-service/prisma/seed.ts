import { PrismaClient } from '@prisma/client';
import { Address } from 'fuels';

const prisma = new PrismaClient();

export const fuelTestEmail = 'test@test.com';
export const fuelTestAddress = new Address(
  'fuel1x9lxcuqjw3vw9tsz9earr2d9etnxueg70m6jhppz65vwlauyescsa2seta'
).toB256(); // 0x317e6c70127458e2ae022e7a31a9a5cae66e651e7ef52b8422d518eff784cc31

// 0x9319c04c3355d1cd8e4110ff6ea2fa1219b5811880ad1f963053d5424ad4cc6f
// 0xab9e77df963723c8d7aa5c017bd6f082c156d06f04e3095574459243ea5aa2b4

async function main() {
  const deleteUsers = prisma.user.deleteMany();
  const deleteAddresses = prisma.address.deleteMany();
  const deleteTransactions = prisma.transaction.deleteMany();
  await prisma.$transaction([deleteUsers, deleteAddresses, deleteTransactions]);

  await prisma.user.upsert({
    where: {
      email: fuelTestEmail,
    },
    update: {
      email: fuelTestEmail,
      addresses: {
        create: {
          address: fuelTestAddress,
        },
      },
    },
    create: {
      email: fuelTestEmail,
      addresses: {
        create: {
          address: fuelTestAddress,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
