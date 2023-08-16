import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, http } from 'viem';
import { foundry, sepolia } from 'viem/chains';

import { transactionPolling } from '~/utils';
import '../load.envs.js';

const notificationServer = express();
const port = 3005;

const fuelProvider = new Provider(process.env.FUEL_PROVIDER_URL || '');

const ethPublicClient = createPublicClient({
  chain: process.env.ETH_CHAIN === 'foundry' ? foundry : sepolia,
  transport: http(),
});

const prisma = new PrismaClient();

notificationServer.get('/', (req: Request, res: Response) => {
  res.send('hello');
});

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);

  setInterval(async () => {
    await transactionPolling(prisma, fuelProvider.url, ethPublicClient);
  }, 5000);
});
