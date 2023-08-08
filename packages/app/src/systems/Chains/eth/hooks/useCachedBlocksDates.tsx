import { useMemo } from 'react';

import { TxCache } from '../utils';

export const useCachedBlocksDates = (blockHashes?: `0x${string}`[]) => {
  const { blockDates, notCachedHashes } = useMemo(() => {
    const datesMap = blockHashes?.reduce((prev, blockHash) => {
      const blockDate = TxCache.getBlockDate(blockHash);
      if (blockDate) {
        return {
          ...prev,
          [blockHash]: new Date(Number(blockDate)),
        };
      }
      return prev;
    }, {} as { [key: string]: Date });

    const notCached =
      blockHashes?.filter((blockHash) => !datesMap?.[blockHash]) || [];

    return { blockDates: datesMap, notCachedHashes: notCached };
  }, [blockHashes]);

  return {
    blockDates,
    notCachedHashes,
  };
};
