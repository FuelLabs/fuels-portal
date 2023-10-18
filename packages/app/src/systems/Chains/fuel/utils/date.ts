import { differenceInSeconds, formatDistanceToNowStrict } from 'date-fns';

export const distanceToNow = (otherDate: Date) => {
  const difference = differenceInSeconds(otherDate, new Date());
  if (difference < 3600) {
    // 3600 seconds = 1 hour
    return formatDistanceToNowStrict(otherDate, {
      roundingMethod: 'ceil',
      unit: 'minute',
    });
  }
  return formatDistanceToNowStrict(otherDate, {
    roundingMethod: 'ceil',
    unit: 'hour',
  });
};
