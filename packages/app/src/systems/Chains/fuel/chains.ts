export type FuelChain = {
  id: number;
  network: string;
  name: string;
  testnet: boolean;
  providerUrl: string;
};

const fuelDev: FuelChain = {
  id: 1001,
  network: 'fuel_devnet',
  name: 'Fuel Devnet',
  testnet: true,
  providerUrl: 'http://localhost:4000/graphql',
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const fuelBeta3_5: FuelChain = {
  id: 1002,
  network: 'fuel_beta3.5',
  name: 'Fuel_Beta_3.5',
  testnet: true,
  providerUrl: 'https://beta3-5-devv.swayswap.io/graphql',
};

export const FUEL_CHAINS = {
  fuelDev,
  fuelBeta3_5,
};
