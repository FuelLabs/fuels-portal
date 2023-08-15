import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, http } from 'viem';
import { foundry } from 'viem/chains';

import { fuelTestEmail } from '../prisma/script';

import { getWithdrawTransactions } from '~/utils';

dotenv.config();

const notificationServer = express();
const port = 3005;

const fuelProvider = new Provider(process.env.FUEL_PROVIDER_URL || '');

const ethPublicClient = createPublicClient({
  chain: foundry,
  transport: http(),
});

const prisma = new PrismaClient();

notificationServer.get('/', (req: Request, res: Response) => {
  res.send('hello');
});

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);

  const data = await prisma.user.findUnique({
    where: {
      email: fuelTestEmail,
    },
    include: {
      addresses: true,
    },
  });

  if (data) {
    const transactions = await getWithdrawTransactions(
      data.addresses[0].address,
      fuelProvider.url,
      ethPublicClient
    );
    const dbTransactions = await Promise.all(
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
            addressId: data.addresses[0].address,
          },
        });
      })
    );
    console.log(`temp`, dbTransactions);
    dbTransactions.forEach((transaction) => {
      if (transaction.status === 'SuccessStatus') {
        console.log('TODO: send email and remove from db');
      }
    });
  }
});
