const { config } = require('dotenv');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const retus = require('retus');

function getVersion() {
  const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, './package.json')).toString()
  );
  return {
    version: packageJson.version,
  };
}

function getEnvName() {
  if (process.env.NODE_ENV === 'production') {
    return '.env.production';
  }
  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
}

function getEthFuelL1Contracts() {
  if (process.env.VITE_ETH_CHAIN === 'foundry') {
    const { body } = retus('http://localhost:8080/deployments.local.json', {
      json: true,
    });

    return body;
  }

  if (process.env.VITE_ETH_CHAIN === 'sepolia') {
    return {
      FuelChainState: '0x053cDdc8D065dEB051584a5ae4DB45348be285c9',
      FuelMessagePortal: '0x457A5a9320d06118764c400163c441cb8551cfa2',
      FuelERC20Gateway: '0x10530552f00079cfF07f3c6D541C651a667Cf41D',
      FuelChainState_impl: '0x9fe3f180aa29Cd49a73e99129A988F36A5800ADa',
      FuelMessagePortal_impl: '0xaf4EBaF4D853809D984d4ee3D6DAA8fa2367396A',
      FuelERC20Gateway_impl: '0xea8BE566210aE54687bFA3b0BF8Ddc3e49767655',
    };
  }
}

// Load from more specific env file to generic ->
[getEnvName(), '.env'].forEach((envFile) => {
  if (!envFile) return;
  config({
    path: resolve(__dirname, envFile),
  });
});

// Export the port to be used on vite server and
// make it accessible to the playwirght tests
process.env.PORT = process.env.NODE_ENV === 'test' ? 3001 : 3000;

// Export the version to be used on database
// and application level
const versions = getVersion();
process.env.VITE_APP_VERSION = versions.version;

// Export ETH Fuel contracts addresses
const ethFuelContracts = getEthFuelL1Contracts();
if (ethFuelContracts && ethFuelContracts.FuelMessagePortal) {
  process.env.VITE_ETH_FUEL_MESSAGE_PORTAL = ethFuelContracts.FuelMessagePortal;
  process.env.VITE_ETH_FUEL_ERC20_GATEWAY = ethFuelContracts.FuelERC20Gateway;
  process.env.VITE_ETH_FUEL_CHAIN_STATE = ethFuelContracts.FuelChainState;
}
