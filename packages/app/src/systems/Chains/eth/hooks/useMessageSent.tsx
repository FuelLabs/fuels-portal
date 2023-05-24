import { useQuery } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';

import { useFuelAccountConnection } from '../../fuel';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useMessageSent = () => {
  const { provider, address: ethAddress } = useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();

  const query = useQuery(
    ['messageSent'],
    async () => {
      //   const logs = await provider!.getLogs({
      //     address: process.env.VITE_FUEL_MESSAGE_PORTAL,
      //     event: parseAbiItem(
      //       'event MessageSent(bytes32 indexed, bytes32 indexed, uint256 indexed, uint64, bytes)'
      //     ),
      //     args: {
      //       sender: ethAddress,
      //       recipient: fuelAddress,
      //     },
      //   });
      const event = {
        inputs: [
          { indexed: true, name: 'sender', type: 'bytes32' },
          { indexed: true, name: 'recipient', type: 'bytes32' },
          { indexed: true, name: 'nonce', type: 'uint256' },
          { indexed: false, name: 'amount', type: 'uint64' },
          { indexed: false, name: 'data', type: 'bytes' },
        ],
        name: 'MessageSent',
        type: 'event',
      } as const;
      const logs = await provider!.getLogs({
        address: process.env.VITE_FUEL_MESSAGE_PORTAL!,
        event,
        fromBlock: 'earliest',
      });
      return logs;
    },
    {
      enabled: !!provider,
    }
  );

  return {
    logs: query.data,
    ...query,
  };
};
