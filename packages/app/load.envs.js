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

function getFuelContracts() {
  const { body } = retus('http://localhost:8081/deployments.json', {
    json: true,
  });

  return body;
}

function getEthFuelL1Contracts() {
  const networkName =
    process.env.VITE_ETH_CHAIN === 'foundry'
      ? 'local'
      : process.env.VITE_ETH_CHAIN;
  const { body } = retus(
    `http://localhost:8080/deployments.${networkName}.json`,
    {
      json: true,
    }
  );

  return body;
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
const fuelContracts = getFuelContracts();
if (ethFuelContracts && ethFuelContracts.FuelMessagePortal) {
  process.env.VITE_ETH_FUEL_MESSAGE_PORTAL = ethFuelContracts.FuelMessagePortal;
  process.env.VITE_ETH_FUEL_ERC20_GATEWAY = ethFuelContracts.FuelERC20Gateway;
  process.env.VITE_ETH_FUEL_CHAIN_STATE = ethFuelContracts.FuelChainState;
  process.env.VITE_ETH_ERC20 = ethFuelContracts.ERC20;
}
if (fuelContracts) {
  process.env.VITE_FUEL_TOKEN_CONTRACT_ID = fuelContracts.fuelTokenContractId;
}
