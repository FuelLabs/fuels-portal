import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { useMemo } from 'react';
import { decodeEventLog } from 'viem';

import { useFuelAccountConnection } from '../../fuel';
import { AbiFuelMessagePortal } from '../services/abi';

import { useEthAccountConnection } from './useEthAccountConnection';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export const useEthDepositLogs = () => {
  const { provider, paddedAddress: ethPaddedAddress } =
    useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();

  const query = useQuery(
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

  const filteredLogs = query.data;

  const decodedEvents = useMemo(() => {
    return filteredLogs?.map((log) =>
      decodeEventLog({
        abi: AbiFuelMessagePortal,
        data: log.data,
        topics: log.topics,
      })
    );
  }, [filteredLogs]);

  const blockQuery = useQuery(
    ['ethBlockDates'],
    async () => {
      if (!filteredLogs) return null;
      const blockPromises = filteredLogs.map((log) => {
        const cachedBlockDate = localStorage.getItem(
          `ethBlockDate-${log?.blockHash}`
        );
        if (cachedBlockDate) {
          return cachedBlockDate;
        }
        if (log.blockHash) {
          const blockPromise = provider.getBlock({ blockHash: log.blockHash });
          return blockPromise;
        }
        return null;
      });
      const blocks = await Promise.all(blockPromises);
      return blocks;
    },
    { enabled: !!(provider && filteredLogs) }
  );

  const dates = useMemo(() => {
    return blockQuery.data?.map((block) => {
      if (typeof block === 'string') {
        // We don't have to multiply by 1000 bc the time is already stored in ms
        return new Date(bn(block).toNumber());
      }
      localStorage.setItem(
        `ethBlockDate-${block?.hash}`,
        bn(block?.timestamp.toString()).mul(1000).toString()
      );
      return block?.timestamp
        ? new Date(bn(block.timestamp.toString()).mul(1000).toNumber())
        : undefined;
    });
  }, [blockQuery.data]);

  return {
    events: decodedEvents as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    logs: filteredLogs,
    dates,
    ...query,
  };
};
