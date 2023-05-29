import { useQuery } from '@tanstack/react-query';

import { calculateBlockAge } from '../../utils';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useBlocks = (blockHashes: `0x${string}`[]) => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block', blockHashes], async () => {
    const blocksPromises = blockHashes?.map(async (blockHash) => {
      return provider.getBlock({ blockHash });
    });
    if (blocksPromises) {
      const blocks = Promise.all(blocksPromises);
      return blocks;
    }
    return [];
  });

  const ages = query.data?.map((block) => {
    return calculateBlockAge(Number(block.timestamp));
  });

  return {
    blocks: query.data,
    ages,
    ...query,
  };
};
