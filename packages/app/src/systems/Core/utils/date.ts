import { formatDistanceToNow } from 'date-fns';

export const calculateDateDiff = (timestamp?: number) => {
  if (!timestamp) {
    return 'pending';
  }
  const blockDate = new Date(timestamp * 1000);
  const diffInDays = formatDistanceToNow(blockDate, { addSuffix: true });
  return diffInDays;
};
