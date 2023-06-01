import { useEthDepositLogs, useBlocks } from '~/systems/Chains';

export const useBridgeTxs = () => {
  const { events, blockHashes, logs } = useEthDepositLogs();
  const { blocks, ages } = useBlocks(blockHashes);

  return { events, blockHashes, logs, blocks, ages };
};
