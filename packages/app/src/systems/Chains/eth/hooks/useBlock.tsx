import { useQuery } from '@tanstack/react-query';

import { calculateBlockAge } from '../../utils';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useBlock = () => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block'], async () => {
    const block = await provider?.getBlock({ blockTag: 'latest' });
    return block;
  });

  const age = calculateBlockAge(Number(query.data?.timestamp));

  return {
    block: query.data,
    age,
    ...query,
  };
};
