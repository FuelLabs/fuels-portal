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

function getBridgeTokenContracts() {
  if (process.env.VITE_FUEL_CHAIN === 'fuelDev') {
    const { body } = retus('http://localhost:8082/deployments', {
      json: true,
    });

    return body;
  }

  if (process.env.VITE_ETH_CHAIN === 'sepolia') {
    return {
      ETH_ERC20: '0xC6387efAD0F184a90B34f397C3d6Fd63135ef790',
      FUEL_TokenContract:
        '0x5ed7bee1e80a64e5163a1c93ff8a2bb806fdff3b7e97808f275c2ba7e3faa2cd',
    };
  }
  return {};
}

function getBridgeSolidityContracts() {
  if (process.env.VITE_ETH_CHAIN === 'foundry') {
    const { body } = retus('http://localhost:8080/deployments.local.json', {
      json: true,
    });

    return body;
  }

  // sepolia config is got from: https://github.com/FuelLabs/fuel-bridge/blob/main/packages/portal-contracts/deployments/deployments.sepolia.json
  if (process.env.VITE_ETH_CHAIN === 'sepolia') {
    return {
      FuelChainState: '0xbe7aB12653e705642eb42EF375fd0d35Cfc45b03',
      FuelMessagePortal: '0x03f2901Db5723639978deBed3aBA66d4EA03aF73',
      FuelERC20Gateway: '0x0C817d089c693Ea435a95c52409984F45847F53c',
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
process.env.PORT = process.env.NODE_ENV === 'test' ? 3005 : 3004;

// Export the version to be used on database
// and application level
const versions = getVersion();
process.env.VITE_APP_VERSION = versions.version;

// Export ETH Fuel contracts addresses
const bridgeSolidityContracts = getBridgeSolidityContracts();
if (bridgeSolidityContracts && bridgeSolidityContracts.FuelMessagePortal) {
  process.env.VITE_ETH_FUEL_MESSAGE_PORTAL =
    bridgeSolidityContracts.FuelMessagePortal;
  process.env.VITE_ETH_FUEL_ERC20_GATEWAY =
    bridgeSolidityContracts.FuelERC20Gateway;
  process.env.VITE_ETH_FUEL_CHAIN_STATE =
    bridgeSolidityContracts.FuelChainState;
}
const bridgeTokenContracts = getBridgeTokenContracts();
if (bridgeTokenContracts) {
  process.env.VITE_FUEL_FUNGIBLE_TOKEN_ID =
    bridgeTokenContracts.FUEL_TokenContract;
  process.env.VITE_ETH_ERC20 = bridgeTokenContracts.ETH_ERC20;
}
