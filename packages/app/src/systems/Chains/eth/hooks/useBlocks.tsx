import { useQuery } from '@tanstack/react-query';
import { bn } from 'fuels';
import { useMemo } from 'react';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useBlocks = (blockHashes?: `0x${string}`[]) => {
  const { provider } = useEthAccountConnection();
  const query = useQuery(
    ['block', blockHashes],
    async () => {
      if (!blockHashes?.length) return null;
      console.log(`QUERY LEVEL blockHashes`, blockHashes);
      const blockPromises = blockHashes?.map((blockHash) => {
        if (blockHash) {
          const blockPromise = provider.getBlock({ blockHash });
          console.log(`blockPromise`, blockPromise);
          return blockPromise;
        }
        return null;
      });
      const blocks = await Promise.all(blockPromises);
      console.log(`blocks`, blocks);
      return blocks;
    },
    {
      enabled: !!blockHashes?.length,
    }
  );

  const blockData = useMemo(() => {
    return query.data?.map((block) => {
      console.log(`block mapping`, block);
      console.log(`ethBlockDate-${block?.hash}`, `ethBlockDate-${block?.hash}`);
      console.log(
        `bn(block?.timestamp.toString()).mul(1000).toString()`,
        bn(block?.timestamp.toString()).mul(1000).toString()
      );
      localStorage.setItem(
        `ethBlockDate-${block?.hash}`,
        bn(block?.timestamp.toString()).mul(1000).toString()
      );
      const date = block?.timestamp
        ? new Date(bn(block.timestamp.toString()).mul(1000).toNumber())
        : undefined;
      return {
        ...block,
        date,
      };
    });
  }, [query.data]);

  return {
    blocks: blockData,
    ...query,
  };
};
