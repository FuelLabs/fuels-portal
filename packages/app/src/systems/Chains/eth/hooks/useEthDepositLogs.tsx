import { useQuery } from '@tanstack/react-query';
import type { BN } from 'fuels';
import { useMemo } from 'react';
import { decodeEventLog } from 'viem';

import { useFuelAccountConnection } from '../../fuel';
import { AbiFuelMessagePortal } from '../services/abi';

import { useBlocks } from './useBlocks';
import { useCachedBlocksDates } from './useCachedBlocksDates';
import { useEthAccountConnection } from './useEthAccountConnection';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export const useEthDepositLogs = () => {
  const { provider, paddedAddress: ethPaddedAddress } =
    useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();

  const { isFetching: isFetchingLogs, ...query } = useQuery(
    ['ethDepositLogs', ethPaddedAddress, fuelAddress],
    async () => {
      const logs = await provider!.getLogs({
        address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
        event: {
          type: 'event',
          name: 'SentMessage',
          inputs: [
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'sender',
              type: 'bytes32',
            },
            {
              indexed: true,
              internalType: 'bytes32',
              name: 'recipient',
              type: 'bytes32',
            },
            {
              indexed: false,
              internalType: 'uint64',
              name: 'nonce',
              type: 'uint64',
            },
            {
              indexed: false,
              internalType: 'uint64',
              name: 'amount',
              type: 'uint64',
            },
            {
              indexed: false,
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
        },
        args: {
          recipient: fuelAddress?.toHexString() as `0x${string}`,
        },
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!(provider && fuelAddress?.toHexString()),
    }
  );

  const blockHashes = useMemo(() => {
    const hashes = query.data?.map((log) => log.blockHash || '0x');

    return hashes;
  }, [query.data]);

  const { blockDates, notCachedHashes } = useCachedBlocksDates(blockHashes);
  const { blocks, isFetching: isFetchingBlocks } = useBlocks(notCachedHashes);

  const logs = useMemo(() => {
    return query.data?.map((log) => {
      const decodedEvent = decodeEventLog({
        abi: AbiFuelMessagePortal,
        data: log.data,
        topics: log.topics,
      });
      let date;
      if (log.blockHash && blockDates) {
        date = blockDates[log.blockHash]
          ? blockDates[log.blockHash]
          : blocks?.find((block) => block.hash === log.blockHash)?.date;
      }
      return {
        ...log,
        event: decodedEvent as unknown as { args: { amount: BN } },
        date,
      };
    });
  }, [query.data, blocks, blockDates]);

  return {
    logs,
    ...query,
    isFetching: isFetchingLogs || isFetchingBlocks,
  };
};
