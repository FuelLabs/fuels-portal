import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { decodeEventLog } from 'viem';
import {
  VITE_ETH_FUEL_MESSAGE_PORTAL,
  VITE_ETH_FUEL_ERC20_GATEWAY,
} from '~/config';

import { useFuelAccountConnection } from '../../fuel';
import type { FuelERC20GatewayArgs } from '../contracts/FuelErc20Gateway';
import { FUEL_ERC_20_GATEWAY } from '../contracts/FuelErc20Gateway';
import type { FuelMessagePortalArgs } from '../contracts/FuelMessagePortal';
import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';

import { useBlocks } from './useBlocks';
import { useCachedBlocksDates } from './useCachedBlocksDates';
import { useEthAccountConnection } from './useEthAccountConnection';

export const useEthDepositLogs = () => {
  const { publicClient: ethPublicClient, paddedAddress: ethPaddedAddress } =
    useEthAccountConnection();
  const { address: fuelAddress } = useFuelAccountConnection();

  const { isFetching: isFetchingLogs, ...query } = useQuery(
    ['ethDepositLogs', ethPaddedAddress, fuelAddress],
    async () => {
      const abiMessageSent = FUEL_MESSAGE_PORTAL.abi.find(
        ({ name, type }) => name === 'MessageSent' && type === 'event'
      );
      const ethLogs = await ethPublicClient!.getLogs({
        address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
        event: {
          type: 'event',
          name: 'MessageSent',
          inputs: abiMessageSent?.inputs || [],
        },
        args: {
          recipient: fuelAddress?.toHexString() as `0x${string}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        fromBlock: 'earliest',
      });

      const abiDeposit = FUEL_ERC_20_GATEWAY.abi.find(
        ({ name, type }) => name === 'Deposit' && type === 'event'
      );
      const erc20Logs = await ethPublicClient!.getLogs({
        address: VITE_ETH_FUEL_ERC20_GATEWAY as `0x${string}`,
        event: {
          type: 'event',
          name: 'Deposit',
          inputs: abiDeposit?.inputs || [],
        },
        args: {
          // TODO: fix here once the FuelErc20Gateway contract informs the recipient in Deposit event, instead of only sender.
          sender: ethPaddedAddress as `0x${string}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        fromBlock: 'earliest',
      });

      return { ethLogs, erc20Logs };
    },
    {
      enabled: !!(ethPublicClient && fuelAddress?.toHexString()),
    }
  );

  const blockHashes = useMemo(() => {
    const ethHashes =
      query.data?.ethLogs.map((log) => log.blockHash || '0x') || [];
    const erc20Hashes =
      query.data?.erc20Logs.map((log) => log.blockHash || '0x') || [];

    return [...ethHashes, ...erc20Hashes];
  }, [query.data]);

  const { blockDates, notCachedHashes } = useCachedBlocksDates(blockHashes);
  const { blocks, isFetching: isFetchingBlocks } = useBlocks(notCachedHashes);

  const ethLogs = useMemo(() => {
    return (
      query.data?.ethLogs.map((log) => {
        const messageSentEvent = decodeEventLog({
          abi: FUEL_MESSAGE_PORTAL.abi,
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
          args: messageSentEvent.args as FuelMessagePortalArgs['MessageSent'],
          date,
        };
      }) || []
    );
  }, [query.data?.ethLogs, blocks, blockDates]);

  const erc20Logs = useMemo(() => {
    return (
      query.data?.erc20Logs.map((log) => {
        const depositEvent = decodeEventLog({
          abi: FUEL_ERC_20_GATEWAY.abi,
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
          args: depositEvent.args as FuelERC20GatewayArgs['Deposit'],
          date,
        };
      }) || []
    );
  }, [query.data?.erc20Logs, blocks, blockDates]);

  return {
    logs: [...ethLogs, ...erc20Logs],
    ...query,
    isFetching: isFetchingLogs || isFetchingBlocks,
  };
};
