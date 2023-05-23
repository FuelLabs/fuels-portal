import { useQuery } from '@tanstack/react-query';

import { useEthAccountConnection } from './useEthAccountConnection';

function calculateBlockAge(timestamp?: number) {
  if (!timestamp) {
    return 'N/A';
  }
  const currentDate = new Date();
  const blockDate = new Date(timestamp * 1000);
  const dif = Math.abs(currentDate.getTime() - blockDate.getTime());
  return `${dif} days ago`;
}

export const useBlock = () => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block'], async () => {
    const block = await provider?.getBlock('latest');
    return block;
  });

  const age = calculateBlockAge(query.data?.timestamp);

  return {
    block: query.data,
    age,
    ...query,
  };
};
