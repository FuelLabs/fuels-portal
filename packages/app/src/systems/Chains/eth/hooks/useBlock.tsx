import { useQuery } from '@tanstack/react-query';

import { useEthAccountConnection } from './useEthAccountConnection';

import { calculateDateDiff } from '~/systems/Core/utils/date';

export const useBlock = () => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block'], async () => {
    const block = await provider?.getBlock('latest');
    return block;
  });

  const age = calculateDateDiff(query.data?.timestamp);

  return {
    block: query.data,
    age,
    ...query,
  };
};
