import '../load.envs.js';

import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, http } from 'viem';
import { foundry, sepolia } from 'viem/chains';

import { handleNewEthBlock } from './utils/handleNewEthBlock';

let NOTIFY_LOCK = false;

const notificationServer = express();
const port = 3005;

const isDev = process.env.ETH_CHAIN === 'foundry';

const fuelProvider = new Provider(process.env.FUEL_PROVIDER_URL!);

const ethPublicClient = createPublicClient({
  chain: isDev ? foundry : sepolia,
  transport: http(process.env.L1_PROVIDER_URL),
});

const prisma = new PrismaClient();

notificationServer.use(express.json());

notificationServer.get('/notify', async (_req: Request, res: Response) => {
  if (!NOTIFY_LOCK) {
    NOTIFY_LOCK = true;
    await handleNewEthBlock(prisma, fuelProvider.url, ethPublicClient);
    NOTIFY_LOCK = false;
  }
  res.send('success');
});

notificationServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);
});
