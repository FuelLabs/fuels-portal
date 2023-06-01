import { useEthDepositLogs, useBlocks } from '~/systems/Chains';

export const useTxsEthToFuel = () => {
  const { events, blockHashes, logs } = useEthDepositLogs();
  const { blocks, ages } = useBlocks(blockHashes);

  const txData = logs?.map((log, index) => {
    const txDatum = {
      block: blocks && blocks[index],
      log,
      event: events[index],
      age: ages && ages[index],
    };
    return txDatum;
  });
  return txData;
};
