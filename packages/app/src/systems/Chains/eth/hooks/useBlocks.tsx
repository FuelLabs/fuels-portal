import { useQuery } from '@tanstack/react-query';

import { useEthAccountConnection } from './useEthAccountConnection';

import { calculateDateDiff } from '~/systems/Core/utils/date';

export const useBlocks = (
  blockHashes: (`0x${string}` | null)[] | undefined
) => {
  const { provider } = useEthAccountConnection();

  const query = useQuery(['blocks', blockHashes], async () => {
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
    return calculateDateDiff(block ? Number(block.timestamp) : undefined);
  });

  return {
    blocks: query.data,
    ages,
    ...query,
  };
};
