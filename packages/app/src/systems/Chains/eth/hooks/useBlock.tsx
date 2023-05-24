import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import { useEthAccountConnection } from './useEthAccountConnection';

function calculateBlockAge(timestamp?: number) {
  if (!timestamp) {
    return 'N/A';
  }
  const blockDate = new Date(timestamp * 1000);
  const diffInDays = formatDistanceToNow(blockDate, { addSuffix: true });
  return diffInDays;
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
