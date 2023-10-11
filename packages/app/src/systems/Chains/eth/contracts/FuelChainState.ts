import { FuelChainState } from '@fuel-bridge/solidity-contracts';
import { PublicClient } from 'viem';
import { VITE_ETH_FUEL_CHAIN_STATE } from '~/config';

export const FUEL_CHAIN_STATE = {
  abi: FuelChainState.abi,
  getCommitSubmitted: async ({
    ethPublicClient,
  }: {
    ethPublicClient: PublicClient;
  }) => {
    const abiCommitSubmitted = FUEL_CHAIN_STATE.abi.find(
      ({ name, type }) => name === 'CommitSubmitted' && type === 'event'
    );
    const logs = await ethPublicClient.getLogs({
      address: VITE_ETH_FUEL_CHAIN_STATE as `0x${string}`,
      event: {
        type: 'event',
        name: 'CommitSubmitted',
        inputs: abiCommitSubmitted?.inputs || [],
      },
      fromBlock: 'earliest',
    });

    return logs;
  },
  getLastBlockCommited: async ({
    ethPublicClient,
  }: {
    ethPublicClient: PublicClient;
  }) => {
    const logs = await FUEL_CHAIN_STATE.getCommitSubmitted({ ethPublicClient });
    const lastCommitBlockHash = logs[logs.length - 1]?.blockHash;
    const lastBlockCommited = await ethPublicClient.getBlock({
      blockHash: lastCommitBlockHash as `0x${string}`,
    });

    return lastBlockCommited;
  },
};
