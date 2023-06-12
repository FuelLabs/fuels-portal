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
        // TODO: put correct data to generate topic[0] hash correctly
        // event: {
        //   type: 'event',
        //   name: 'MessageSent',
        //   inputs: [
        //     { type: 'bytes32', indexed: true, name: 'sender' },
        //     { type: 'bytes32', indexed: true, name: 'recipient' },
        //     { type: 'uint256', indexed: true, name: 'nonce' },
        //     { type: 'uint64', indexed: false, name: 'amount' },
        //     { type: 'bytes', indexed: false, name: 'data' },
        //   ],
        // },
        // args: {
        //   sender: ethPaddedAddress,
        //   recipient: fuelAddress?.toHexString() as `0x${string}`,
        // },
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!(provider && fuelAddress?.toHexString()),
    }
  );

  // TODO: remove this filtering when previous query gets fixed and returns correct data
  const filteredLogs = query.data?.filter((log) => {
    if (log.topics.length < 3) {
      return false;
    }

    return (
      // log.topics[1] === ethPaddedAddress ||
      log.topics[2] === fuelAddress?.toHexString()
    );
  });

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
