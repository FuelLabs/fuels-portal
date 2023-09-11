import { PrismaClient } from '@prisma/client';
import { Address } from 'fuels';

const prisma = new PrismaClient();

export const fuelTestEmail = 'test@test.com';
export const fuelTestAddress = new Address(
  'fuel1a22g3l4d5d24fg4a77sejagj8s96smx84qcvfwm48ka9rx05v4vq6gn7tk'
).toB256();

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
