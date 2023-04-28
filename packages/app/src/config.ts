import { foundry, goerli } from 'wagmi/chains';

export const {
  VITE_FUEL_PROVIDER_URL,
  VITE_ALCHEMY_ID,
  VITE_WALLETCONNECT_ID,
  NODE_ENV,
} = import.meta.env;

export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

export const ETH_CHAIN = IS_TEST ? goerli : foundry;
const fuelDev = {
  id: 1001,
  network: 'fuel_devnet',
  name: 'Fuel Devnet',
  testnet: true,
};
const fuelBeta3 = {
  id: 1001,
  network: 'fuel_beta3',
  name: 'Fuel Beta3',
  testnet: true,
};
export const FUEL_CHAIN = IS_TEST ? fuelBeta3 : fuelDev;
