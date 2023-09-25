import '../load.envs.js';

import { PrismaClient } from '@prisma/client';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, http } from 'viem';
import { foundry, sepolia } from 'viem/chains';

import { handleNewEthBlock } from './utils/handleNewEthBlock';

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

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);
  setInterval(async () => {
    await handleNewEthBlock(prisma, fuelProvider.url, ethPublicClient);
  }, 6000);
});
