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

  console.log(`emails`, emails[0].addresses);

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
        const transactionsWithBlockHeights = await getWithdrawTransactions(
          address.address,
          fuelProviderUrl,
          ethPublicClient
        );

        dbTransactions = await Promise.all(
          transactionsWithBlockHeights.map((transactionWithBlockHeight) => {
            console.log(
              `transactionWithBlockHeight.blockHeight`,
              transactionWithBlockHeight.blockHeight
            );
            return prisma.transaction.upsert({
              where: {
                transactionId: transactionWithBlockHeight.id,
              },
              update: {
                status: transactionWithBlockHeight.status || '',
                blockHeight: transactionWithBlockHeight.blockHeight,
              },
              create: {
                transactionId: transactionWithBlockHeight.id,
                status: transactionWithBlockHeight.status || '',
                addressId: address.address,
                blockHeight: transactionWithBlockHeight.blockHeight,
              },
            });
          })
        );
        console.log(`dbTransactions`, dbTransactions);
        // console.log(`temp`, dbTransactions);
        // dbTransactions.forEach((transaction) => {
        //   if (transaction.status === 'SuccessStatus') {
        //     console.log('TODO: send email and update the db');
        //   }
        // });
      });
    }
  );
};
