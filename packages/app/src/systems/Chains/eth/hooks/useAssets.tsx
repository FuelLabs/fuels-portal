import { ETH_UNITS, ethLogoSrc } from '../utils';

import { VITE_ETH_ERC20_TOKEN_ADDRESS } from '~/config';

export const useAssets = () => {
  return {
    assets: [
      {
        decimals: ETH_UNITS,
        symbol: 'ETH',
        image: ethLogoSrc,
      },
      {
        address: VITE_ETH_ERC20_TOKEN_ADDRESS as `0x${string}`,
        decimals: ETH_UNITS,
        symbol: 'TKN',
        // image: ethLogoSrc,
      },
    ],
  };
};
