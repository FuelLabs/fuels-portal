import type { PrismaClient } from '@prisma/client';
import type { PublicClient } from 'viem';

import { getWithdrawTransactions } from './withdrawTransactions';

export const transactionPolling = async (
  prisma: PrismaClient,
  fuelProviderUrl: string,
  ethPublicClient: PublicClient
) => {
  const emails = await prisma.user.findMany({
    include: {
      addresses: true,
    },
  });

  emails.forEach(
    (
      email: {
        addresses: {
          address: string;
          withdrawerId: number;
        }[];
      } & {
        id: number;
        email: string;
      }
    ) => {
      const addresses = email.addresses;
      addresses.forEach(async (address) => {
        let dbTransactions = [];
        const transactions = await getWithdrawTransactions(
          address.address,
          fuelProviderUrl,
          ethPublicClient
        );
        dbTransactions = await Promise.all(
          transactions.map((transaction) => {
            return prisma.transaction.upsert({
              where: {
                transactionId: transaction.node.id,
              },
              update: {
                status: transaction.node.status?.type || '',
              },
              create: {
                transactionId: transaction.node.id,
                status: transaction.node.status?.type || '',
                addressId: address.address,
              },
            });
          })
        );
        console.log(`temp`, dbTransactions);
        dbTransactions.forEach((transaction) => {
          if (transaction.status === 'SuccessStatus') {
            console.log('TODO: send email and update the db');
          }
        });
      });
    }
  );
};
