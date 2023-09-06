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
  if (process.env.ETH_CHAIN === 'foundry') {
    const { body } = retus('http://localhost:8080/deployments.local.json', {
      json: true,
    });

    return body;
  }

  if (process.env.ETH_CHAIN === 'sepolia') {
    return {
      FuelChainState: '0xbe7aB12653e705642eb42EF375fd0d35Cfc45b03',
      FuelMessagePortal: '0x03f2901Db5723639978deBed3aBA66d4EA03aF73',
      FuelERC20Gateway: '0x0C817d089c693Ea435a95c52409984F45847F53c',
      FuelChainState_impl: '0xd729074a050CEf155BC984a0519499C248fABE27',
      FuelMessagePortal_impl: '0x4AF37b8205De46a5C4885EEcd6cFE290Df969CbD',
      FuelERC20Gateway_impl: '0x13e56579Bd678541DE89d75203B7b04c7B8481E6',
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
process.env.APP_VERSION = versions.version;

// Export ETH Fuel contracts addresses
const ethFuelContracts = getEthFuelL1Contracts();
if (ethFuelContracts && ethFuelContracts.FuelMessagePortal) {
  process.env.ETH_FUEL_MESSAGE_PORTAL = ethFuelContracts.FuelMessagePortal;
  process.env.ETH_FUEL_ERC20_GATEWAY = ethFuelContracts.FuelERC20Gateway;
  process.env.ETH_FUEL_CHAIN_STATE = ethFuelContracts.FuelChainState;
}
