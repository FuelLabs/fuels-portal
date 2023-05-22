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

const fuelBeta3: FuelChain = {
  id: 1002,
  network: 'fuel_beta3',
  name: 'Fuel Beta3',
  testnet: true,
  providerUrl: 'https://beta-3.fuel.network/graphql',
};

export const FUEL_CHAINS = {
  fuelDev,
  fuelBeta3,
};
