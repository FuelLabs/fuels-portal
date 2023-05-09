export const {
  VITE_FUEL_PROVIDER_URL,
  VITE_ALCHEMY_ID,
  VITE_WALLETCONNECT_ID,
  VITE_ETH_FUEL_MESSAGE_PORTAL,
  NODE_ENV,
} = import.meta.env;

export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';
