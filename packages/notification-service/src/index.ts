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

const fuelProvider = new Provider(
  isDev ? process.env.FUEL_PROVIDER_URL! : 'https://beta-4.fuel.network/graphql'
);

const ethPublicClient = createPublicClient({
  chain: isDev ? foundry : sepolia,
  transport: isDev
    ? http('http://localhost:8545')
    : http(
        'https://eth-sepolia.g.alchemy.com/v2/v_2w-fv1Jg2R3TMKbT3N_p7zue7EeA9N'
      ),
});

const prisma = new PrismaClient();

notificationServer.use(express.json());

notificationServer.get('/notify', async (req: Request, res: Response) => {
  if (!NOTIFY_LOCK) {
    NOTIFY_LOCK = true;
    await handleNewEthBlock(prisma, fuelProvider.url, ethPublicClient);
    NOTIFY_LOCK = false;
  }
  res.send('success');
});

notificationServer.post('/signup', async (req: Request, res: Response) => {
  const user = await prisma.user.upsert({
    where: {
      email: req.body.email,
    },
    update: {
      addresses: {
        connectOrCreate: {
          create: {
            address: req.body.address,
          },
          where: {
            address: req.body.address,
          },
        },
      },
    },
    create: {
      email: req.body.email,
      addresses: {
        connectOrCreate: {
          create: {
            address: req.body.address,
          },
          where: {
            address: req.body.address,
          },
        },
      },
    },
    include: {
      addresses: true,
    },
  });
  console.log(`user`, user);
  res.send('success');
});

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);
});
