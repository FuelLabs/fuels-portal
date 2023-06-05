import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';

import { useEthAccountConnection } from './useEthAccountConnection';

import { calculateDateDiff } from '~/systems/Core/utils/date';

export const useBlock = (blockHash?: `0x${string}`) => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(
    ['block', blockHash],
    async () => {
      const block = await provider.getBlock({ blockHash });
      return block;
    },
    {
      enabled: !!blockHash,
    }
  );

  return {
    block: {
      ...query.data,
      date: query.data?.timestamp
        ? new Date(bn(query.data?.timestamp.toString()).mul(1000).toNumber())
        : undefined,
    },
    ...query,
  };
};
