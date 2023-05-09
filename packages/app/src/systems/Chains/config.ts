import { foundry, goerli } from 'wagmi/chains';

import { fuelBeta3, fuelDev } from './fuel/chains';

import { IS_TEST } from '~/config';

export const ETH_CHAIN = IS_TEST ? goerli : foundry;
export const FUEL_CHAIN = IS_TEST ? fuelBeta3 : fuelDev;
