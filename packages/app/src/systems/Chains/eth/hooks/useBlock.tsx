import { useQuery } from '@tanstack/react-query';

import { useEthAccountConnection } from './useEthAccountConnection';

import { calculateDateDiff } from '~/systems/Core/utils/date';

export const useBlock = (blockHash?: `0x${string}`) => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block', blockHash], async () => {
    const block = blockHash
      ? await provider.getBlock({ blockHash })
      : await provider?.getBlock({ blockTag: 'latest' });
    return block;
  });

  const age = calculateDateDiff(Number(query.data?.timestamp));

  return {
    block: query.data,
    age,
    ...query,
  };
};
