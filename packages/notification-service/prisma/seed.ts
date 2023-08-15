import { PrismaClient } from '@prisma/client';
import { Address } from 'fuels';

const prisma = new PrismaClient();

export const fuelTestEmail = 'test@test.com';
export const fuelTestAddress = new Address(
  'fuel1jraekwq3e2f8fn7ldypjvvy3zqgzgf99supvcylzhxqvrr0mx3nqdnzpvw'
).toB256();

async function main() {
  await prisma.user.upsert({
    where: {
      email: fuelTestEmail,
    },
    update: {},
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
