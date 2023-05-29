import { useQuery } from '@tanstack/react-query';
import { decodeEventLog, parseAbi, parseAbiItem } from 'viem';

import { useFuelAccountConnection } from '../../fuel';
import { AbiFuelMessagePortal } from '../services/abi';

import { useEthAccountConnection } from './useEthAccountConnection';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

const event = {
  inputs: [
    { indexed: true, name: 'sender', type: 'bytes32' },
    { indexed: true, name: 'recipient', type: 'bytes32' },
    { indexed: true, name: 'nonce', type: 'uint256' },
    { indexed: false, name: 'amount', type: 'uint64' },
    { indexed: false, name: 'data', type: 'bytes' },
  ],
  name: 'SentMessage',
  type: 'event',
} as const;

export const useMessageSent = () => {
  const { provider, address: ethAddress } = useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();

  const query = useQuery(
    ['ethDepositLogs', ethAddress, fuelAddress],
    async () => {
      // const paddedEthAddress = `0x000000000000000000000000${ethAddress?.slice(
      //   2
      // )}` as `0x${string}`;
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
        // args: {
        //   nonce: 4n,
        // },
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!provider,
    }
  );

  const filteredLogs = query.data?.slice(4);

  const blockHashes = filteredLogs?.map((log) => {
    return log.blockHash!;
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
    ...query,
  };
};
