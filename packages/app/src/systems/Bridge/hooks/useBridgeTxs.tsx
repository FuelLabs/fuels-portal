import { useTxsEthToFuel, useTxsFuelToEth } from '~/systems/Chains';

export const useBridgeTxs = () => {
  const { txs: ethToFuelTxs, isLoading: isEthToFuelLoading } =
    useTxsEthToFuel();
  console.log(`isEthToFuelLoading`, isEthToFuelLoading);
  const { txs: fuelToEthTxs, isLoading: isFuelToEthLoading } =
    useTxsFuelToEth();
  console.log(`isFuelToEthLoading`, isFuelToEthLoading);
  const allTxs = [...(ethToFuelTxs || []), ...(fuelToEthTxs || [])];
  const sortedTxs = allTxs.sort((a, b) => {
    if (a.date === undefined) {
      return 1;
    }
    if (b.date === undefined) {
      return -1;
    }
    return a.date.getTime() - b.date.getTime();
  });

  return {
    txs: sortedTxs,
    isLoading: isEthToFuelLoading || isFuelToEthLoading,
  };
};
