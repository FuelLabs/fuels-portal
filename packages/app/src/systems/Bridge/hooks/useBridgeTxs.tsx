import { useTxsEthToFuel } from '~/systems/Chains';

export const useBridgeTxs = () => {
  const ethTxData = useTxsEthToFuel();
  // TODO sort by age when we have multiple lists of transactions
  return ethTxData;
};
