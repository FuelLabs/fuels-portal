import type { SupportedChain } from '../../types';
import { FUEL_CHAINS } from '../chains';

export const isFuelChain = (chain?: SupportedChain | null) => {
  return !!Object.keys(FUEL_CHAINS).find(
    (key) => FUEL_CHAINS[key].name === chain?.name
  );
};
