import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';

export const useBlock = (blockHash?: string) => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    ['fuelBlock', blockHash],
    async () => {
      try {
        if (!blockHash) return null;

        const provider = await fuel?.getProvider();
        console.log('two...');
        if (!provider) return null;

        console.log('three...');
        const block = await provider.getBlock(blockHash);
        console.log('block in querey: ', block);
        return block;
      } catch (error: unknown) {
        console.log('error: ', error);
        return null;
      }
    },
    { enabled: !!fuel && !!blockHash }
  );

  return {
    block: data || undefined,
    ...query,
  };
};
