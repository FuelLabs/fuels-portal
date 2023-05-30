import { useQuery } from '@tanstack/react-query';

import { calculateBlockAge } from '../../utils';

import { useEthAccountConnection } from './useEthAccountConnection';

export const useBlocks = (
  blockHashes: (`0x${string}` | null)[] | undefined
) => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['block', blockHashes], async () => {
    const blocksPromises = blockHashes?.map(async (blockHash) => {
      if (blockHash) {
        return provider.getBlock({ blockHash });
      }
      return null;
    });
    if (blocksPromises) {
      const blocks = Promise.all(blocksPromises);
      return blocks;
    }
    return [];
  });

  const ages = query.data?.map((block) => {
    return calculateBlockAge(block ? Number(block.timestamp) : undefined);
  });

  return {
    blocks: query.data,
    ages,
    ...query,
  };
};
