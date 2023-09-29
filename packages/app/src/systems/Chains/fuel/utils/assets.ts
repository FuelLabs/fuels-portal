import { VITE_FUEL_FUNGIBLE_TOKEN_ID } from '~/config';

import { ETH_SYMBOL, ethLogoSrc } from '../../eth/utils';

import { FUEL_UNITS } from './chain';

export const FUEL_ASSETS = [
  {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    decimals: FUEL_UNITS,
    symbol: ETH_SYMBOL,
    image: ethLogoSrc,
  },
  {
    address: VITE_FUEL_FUNGIBLE_TOKEN_ID,
    decimals: FUEL_UNITS,
    symbol: 'TKN',
  },
];
