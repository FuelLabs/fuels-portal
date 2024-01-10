export type FuelChain = {
  id: number;
  network: string;
  name: string;
  testnet: boolean;
  providerUrl: string;
};

const fuelDev: FuelChain = {
  id: 10,
  network: 'fuel_devnet',
  name: 'Fuel Devnet',
  testnet: true,
  providerUrl: 'http://localhost:4000/graphql',
};

const fuelBeta4: FuelChain = {
  id: 0,
  network: 'fuel_beta4',
  name: 'Fuel Beta 4',
  testnet: true,
  providerUrl: 'https://beta-4.fuel.network/graphql',
};

const fuelBeta5: FuelChain = {
  id: 0,
  network: 'fuel_beta5',
  name: 'Fuel Beta 5',
  testnet: true,
  providerUrl: 'https://beta-5.swayswap.io/graphql',
};

export const FUEL_CHAINS = {
  fuelDev,
  fuelBeta4,
  fuelBeta5,
};
