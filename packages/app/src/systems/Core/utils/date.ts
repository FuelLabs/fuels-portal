import { formatDistanceToNow } from 'date-fns';

export const calculateBlockAge = (timestamp?: number) => {
  if (!timestamp) {
    return 'N/A';
  }
  const blockDate = new Date(timestamp * 1000);
  const diffInDays = formatDistanceToNow(blockDate, { addSuffix: true });
  return diffInDays;
};
