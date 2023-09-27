import type { SupportedChain } from '../../types';
import { ETH_CHAINS } from '../chains';

import { ethLogoSrc } from './logo';

export const ETH_UNITS = 18;
export const ETH_SYMBOL = 'ETH';
export const ETH_ASSET = {
  image: ethLogoSrc,
  symbol: ETH_SYMBOL,
  decimals: ETH_UNITS,
};

export const isEthChain = (chain: SupportedChain | undefined | null) => {
  return !!Object.keys(ETH_CHAINS).find(
    (key) => ETH_CHAINS[key].network === chain?.network
  );
};
