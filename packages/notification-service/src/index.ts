import '../load.envs.js';

import { PrismaClient } from '@prisma/client';
// import type { Request, Response } from 'express';
import express from 'express';
import { Provider } from 'fuels';
import { createPublicClient, http } from 'viem';
// import type { ChainProviderFn } from 'wagmi';
// import { configureChains } from 'wagmi';
import { foundry, sepolia } from 'viem/chains';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { infuraProvider } from 'wagmi/providers/infura';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { publicProvider } from 'wagmi/providers/public';

//import { transactionPolling } from '~/utils';

//import { FUEL_CHAIN_STATE } from './contracts/FuelChainState';

import { handleNewEthBlock } from './utils/handleNewEthBlock';

const notificationServer = express();
const port = 3005;

const isDev = process.env.ETH_CHAIN === 'foundry';

const fuelProvider = new Provider(
  isDev ? process.env.FUEL_PROVIDER_URL! : 'https://beta-4.fuel.network/graphql'
);

// const chainsToConnect = [isDev ? foundry : sepolia];
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const providers: ChainProviderFn<any>[] = [
//   alchemyProvider({ apiKey: process.env.ALCHEMY_ID! }),
//   infuraProvider({ apiKey: process.env.INFURA_ID! }),
//   jsonRpcProvider({
//     rpc: (c) => {
//       return { http: c.rpcUrls.default.http[0] };
//     },
//   }),
//   publicProvider(),
// ];

// export const { publicClient, chains, webSocketPublicClient } = configureChains(
//   chainsToConnect,
//   providers
// );

// const ethPublicClient = publicClient({ chainId: 31337 });

const ethPublicClient = createPublicClient({
  chain: isDev ? foundry : sepolia,
  transport: isDev
    ? http('http://localhost:8545')
    : http(
        'https://eth-sepolia.g.alchemy.com/v2/v_2w-fv1Jg2R3TMKbT3N_p7zue7EeA9N'
      ),
});

console.log(`ethPublicClient`, ethPublicClient.chain.rpcUrls);

const prisma = new PrismaClient();

notificationServer.use(express.json());

// notificationServer.use('/', async (req: Request, res: Response) => {
//   //console.dir(req.body, { depth: null });

//   // Grab the last commit event from the contract
//   const fuelChainState = getContract({
//     abi: FUEL_CHAIN_STATE.abi,
//     address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
//     publicClient: ethPublicClient,
//   });

//   const abiFuelChainState = FUEL_CHAIN_STATE.abi.find(
//     ({ name, type }) => name === 'CommitSubmitted' && type === 'event'
//   );
//   const logs = await ethPublicClient.getLogs({
//     address: process.env.ETH_FUEL_CHAIN_STATE as `0x${string}`,
//     event: {
//       type: 'event',
//       name: 'CommitSubmitted',
//       inputs: abiFuelChainState?.inputs || [],
//     },
//     fromBlock: 'earliest',
//   });

//   const args = logs.at(-1)?.args as unknown as {
//     commitHeight: bigint;
//     blockHash: string;
//   };

//   const block = await fuelProvider.getBlock(args.blockHash);
//   const isFinalized = await fuelChainState.read.finalized([
//     args.blockHash,
//     block?.height,
//   ]);

//   //console.log(`isFinalized`, isFinalized);

//   if (isFinalized) {
//     const withdraws = await prisma.transaction.findMany({
//       where: {
//         AND: [
//           {
//             blockHeight: {
//               not: undefined,
//             },
//           },
//           {
//             blockHeight: {
//               lt: args.commitHeight,
//             },
//           },
//         ],
//       },
//     });
//     //console.log(`withdraws`, withdraws);
//   }

//   res.send('hello');
// });

notificationServer.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Notification server running at http://localhost:${port}`);
  setInterval(async () => {
    await handleNewEthBlock(prisma, fuelProvider.url, ethPublicClient);
  }, 6000);
});
