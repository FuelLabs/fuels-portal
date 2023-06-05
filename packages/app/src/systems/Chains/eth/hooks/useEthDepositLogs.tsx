import { useQuery } from '@tanstack/react-query';
import { decodeEventLog } from 'viem';

import { useFuelAccountConnection } from '../../fuel';
import { AbiFuelMessagePortal } from '../services/abi';

import { useEthAccountConnection } from './useEthAccountConnection';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export const useEthDepositLogs = () => {
  const { provider, address: ethAddress } = useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();
  const paddedEthAddress = `0x000000000000000000000000${ethAddress?.slice(
    2
  )}` as `0x${string}`;
  const query = useQuery(
    ['ethDepositLogs', ethAddress, fuelAddress],
    async () => {
      const logs = await provider!.getLogs({
        address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!provider,
    }
  );

  // filter logs ourselves bc I cannot get viem to do it
  // get all logs where the user is the sender or recipient
  const filteredLogs = query.data?.filter((log) => {
    // we can ignore logs where the topics length is less than 3
    // we do not check for inequality because nonce can be indexed as well
    if (log.topics.length < 3) {
      return false;
    }
    return (
      log.topics[1] === paddedEthAddress ||
      log.topics[2] === fuelAddress?.toHexString()
    );
  });

  const blockHashes = filteredLogs?.map((log) => {
    return log.blockHash;
  });

  const decodedEvents = filteredLogs?.map((log) => {
    return decodeEventLog({
      abi: AbiFuelMessagePortal,
      data: log.data,
      topics: log.topics,
    });
  });

  return {
    events: decodedEvents as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    blockHashes,
    logs: filteredLogs,
    ...query,
  };
};
