import { useTxsEthToFuel } from '~/systems/Chains';
import { useTxsFuelToEth } from '~/systems/Chains/fuel/hooks/useTxsFuelToEth';

export const useBridgeTxs = () => {
  const { txs: ethToFuelTxs } = useTxsEthToFuel();
  const { txs: fuelToEthTxs } = useTxsFuelToEth();

  console.log('eth txs: ', ethToFuelTxs);

  const allTxs = [...(ethToFuelTxs || []), ...(fuelToEthTxs || [])];
  console.log('temp: ', allTxs);
  const sortedTxs = allTxs.sort((a, b) => {
    if (a.date === undefined) {
      return 1;
    }
    if (b.date === undefined) {
      return -1;
    }
    return a.date.getTime() - b.date.getTime();
  });

  return sortedTxs;
};
