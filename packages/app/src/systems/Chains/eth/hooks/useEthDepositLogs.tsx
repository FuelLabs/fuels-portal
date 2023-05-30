import { useQuery } from '@tanstack/react-query';
import { decodeEventLog } from 'viem';

import { useFuelAccountConnection } from '../../fuel';
import { AbiFuelMessagePortal } from '../services/abi';

import { useEthAccountConnection } from './useEthAccountConnection';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

// const event = {
//   inputs: [
//     { indexed: true, name: 'sender', type: 'bytes32' },
//     { indexed: true, name: 'recipient', type: 'bytes32' },
//     { indexed: true, name: 'nonce', type: 'uint256' },
//     { indexed: false, name: 'amount', type: 'uint64' },
//     { indexed: false, name: 'data', type: 'bytes' },
//   ],
//   name: 'SentMessage', // I've tried MessageSent
//   type: 'event',
// } as const;

export const useEthDepositLogs = () => {
  const { provider, address: ethAddress } = useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();
  const paddedEthAddress = `0x000000000000000000000000${ethAddress?.slice(
    2
  )}` as `0x${string}`;
  const query = useQuery(
    ['ethDepositLogs', ethAddress, fuelAddress],
    async () => {
      // const typedFuelAddress = fuelAddress?.toHexString() as `0x${string}`;
      // console.log('filter on address: ', VITE_ETH_FUEL_MESSAGE_PORTAL);
      const logs = await provider!.getLogs({
        address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
        // event,
        // event: parseAbiItem(
        //   'event SentMessage(bytes32 indexed sender, bytes32 indexed recipient, uint256 indexed nonce, uint64 amount, bytes data)'
        // ),
        // args: {
        //   sender: paddedEthAddress,
        //   recipient: typedFuelAddress,
        // },
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!provider,
    }
  );

  // filter logs ourselves bc I cannot get viem to do it
  // ignore the first four logs as they are setup
  let filteredLogs = query.data?.slice(4);
  // get all logs where the user is the sender or recipient
  filteredLogs = filteredLogs?.filter((log) => {
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
    events: decodedEvents,
    blockHashes,
    logs: filteredLogs,
    ...query,
  };
};
