import { ethers } from 'ethers';
import type { WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

export const ethProvider = new ethers.providers.JsonRpcProvider(
  'http://localhost:9545'
);
export const ethWallet = new ethers.Wallet(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  ethProvider
);
export const fuelProvider = new Provider('http://localhost:4000/graphql');
export const fuelWallet: WalletUnlocked = Wallet.fromPrivateKey(
  '0x6303bacbe42085ab84211bba63f4946649bcfb81c30510cad46e6e4efbccbd72',
  fuelProvider
);
