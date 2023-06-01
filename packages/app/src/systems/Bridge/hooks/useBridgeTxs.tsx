import { useTxsEthToFuel } from '~/systems/Chains';

export const useBridgeTxs = () => {
  const ethTxData = useTxsEthToFuel();

  return ethTxData;
};
