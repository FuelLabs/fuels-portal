import { useTxsEthToFuel } from '~/systems/Chains';

export const useBridgeTxs = () => {
  const { txs: ethToFuelTxs } = useTxsEthToFuel();

  // TODO sort by age when we have multiple lists of transactions

  return [...(ethToFuelTxs || [])];
};
