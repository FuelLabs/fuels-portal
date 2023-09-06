import '../load.envs.js';

import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, getContract, http } from 'viem';
import { foundry, sepolia } from 'viem/chains';

import { FUEL_CHAIN_STATE } from './contracts/FuelChainState';

import { transactionPolling } from '~/utils';

const notificationServer = express();
const port = 3005;

const fuelProvider = new Provider('https://beta-4.fuel.network/graphql');

const ethPublicClient = createPublicClient({
  chain: process.env.ETH_CHAIN === 'foundry' ? foundry : sepolia,
  transport: http(
    'https://eth-sepolia.g.alchemy.com/v2/v_2w-fv1Jg2R3TMKbT3N_p7zue7EeA9N'
  ),
});

const prisma = new PrismaClient();

notificationServer.use(express.json());

notificationServer.use('/', async (req: Request, res: Response) => {
  console.dir(req.body, { depth: null });

  // Grab the last commit event from the contract
  const fuelChainState = getContract({
    abi: FUEL_CHAIN_STATE.abi,
    address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
    publicClient: ethPublicClient,
  });

  const abiFuelChainState = FUEL_CHAIN_STATE.abi.find(
    ({ name, type }) => name === 'CommitSubmitted' && type === 'event'
  );
  const logs = await ethPublicClient.getLogs({
    address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
    event: {
      type: 'event',
      name: 'CommitSubmitted',
      inputs: abiFuelChainState?.inputs || [],
    },
    fromBlock: 'earliest',
  });

  const args = logs.at(-1)?.args as unknown as {
    commitHeight: bigint;
    blockHash: string;
  };

  const block = await fuelProvider.getBlock(args.blockHash);
  const isFinalized = await fuelChainState.read.finalized([
    args.blockHash,
    block?.height,
  ]);

  console.log(`isFinalized`, isFinalized);

  if (isFinalized) {
    const withdraws = await prisma.transaction.findMany({
      where: {
        AND: [
          {
            blockHeight: {
              not: undefined,
            },
          },
          {
            blockHeight: {
              lt: args.commitHeight,
            },
          },
        ],
      },
    });
    console.log(`withdraws`, withdraws);
  }

  res.send('hello');
});

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);

  setInterval(async () => {
    await transactionPolling(prisma, fuelProvider.url, ethPublicClient);
  }, 6000);
});
