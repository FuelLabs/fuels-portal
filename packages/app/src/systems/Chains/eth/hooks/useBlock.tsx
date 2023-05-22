import { useQuery } from '@tanstack/react-query';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useBlock = () => {
  const { provider } = useEthAccountConnection();

  const { data, ...queryProps } = useQuery(['block'], async () => {
    const block = await provider?.getBlock('latest');
    return block;
  });

  return {
    data,
    ...queryProps,
  };
};
