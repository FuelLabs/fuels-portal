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
    // On the ci I was encountering issues
    // with the erc20-deployer server not
    // completely started before the e2e tests began
    const IS_CI = !!process.env.CI;
    const { body } = retus('http://localhost:8082/deployments', {
      json: true,
      retry: {
        limit: IS_CI ? 5 : 2,
        delay: IS_CI ? 15000 : 0,
      },
    });

    return body;
  }

  if (process.env.VITE_ETH_CHAIN === 'sepolia') {
    return {
      ETH_ERC20: '0xC6387efAD0F184a90B34f397C3d6Fd63135ef790',
      FUEL_TokenContract:
        '0x7d3e3721d96108b71e187aa17c3330ac400637a2649490f4b3d964cbf1b8943e',
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
      FuelChainState: '0xb65850FB7eA866f8730Ce713657ed965407F6472',
      FuelMessagePortal: '0xBf340BAC79c301B264E2a5dEa51b7F61eb3e666A',
      FuelERC20Gateway: '0x749E27d070E2F4a3D6CED522a0D4BDCB37fA95ba',
      FuelERC721Gateway: '0x4aC11e55652b4e13Fc8dB6F42bB26793605d03B8',
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
  process.env.VITE_FUEL_FUNGIBLE_CONTRACT_ID =
    bridgeTokenContracts.FUEL_TokenContract;
  process.env.VITE_FUEL_FUNGIBLE_ASSET_ID =
    bridgeTokenContracts.FUEL_TokenAsset || '';
  process.env.VITE_ETH_ERC20 = bridgeTokenContracts.ETH_ERC20;
}
