import type {
  Provider as EthProvider,
  TransactionResponse as EthTransactionResponse,
} from '@ethersproject/providers';
import type { Signer as EthSigner } from 'ethers';
import type { BN, WalletUnlocked } from 'fuels';
import { bn, Provider as FuelProvider, Wallet } from 'fuels';

import { FuelMessagePortal__factory } from '../fuel-v2-contracts/factories/FuelMessagePortal__factory';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export type TxEthToFuelInputs = {
  create: {
    amount: BN;
    ethSigner?: EthSigner;
  };
  getDepositNonce: {
    ethTx?: EthTransactionResponse;
    ethProvider?: EthProvider;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
  };
};

export class TxEthToFuelService {
  static connectToFuelMessagePortal(signerOrProvider: EthSigner | EthProvider) {
    return FuelMessagePortal__factory.connect(
      VITE_ETH_FUEL_MESSAGE_PORTAL,
      signerOrProvider
    );
  }

  static async create(input: TxEthToFuelInputs['create']) {
    if (!input.ethSigner) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input.amount) {
      throw new Error('Need amount to send');
    }

    const fuelPortal = TxEthToFuelService.connectToFuelMessagePortal(
      input.ethSigner
    );

    // TODO: receive fuelAddress from inputs
    const fuelProvider = new FuelProvider('http://localhost:4000/graphql');
    const fuelWallet: WalletUnlocked = Wallet.fromPrivateKey(
      '0x6303bacbe42085ab84211bba63f4946649bcfb81c30510cad46e6e4efbccbd72',
      fuelProvider
    );
    const tx = await fuelPortal.depositETH(fuelWallet.address.toHexString(), {
      value: input.amount.toHex(),
    });

    return tx.hash;
  }

  static async getDepositNonce(input: TxEthToFuelInputs['getDepositNonce']) {
    if (!input?.ethTx) {
      throw new Error('No eth TX');
    }
    if (!input?.ethProvider) {
      throw new Error('No eth Provider');
    }

    const { ethTx, ethProvider } = input;
    const fuelPortal =
      TxEthToFuelService.connectToFuelMessagePortal(ethProvider);

    const receipt = await ethTx.wait();
    const event = fuelPortal.interface.parseLog(receipt.logs[0]);
    const depositNonce = bn(event.args.nonce.toHexString());

    return depositNonce;
  }

  static async getFuelMessage(input: TxEthToFuelInputs['getFuelMessage']) {
    if (!input?.ethTxNonce) {
      throw new Error('No nonce informed');
    }
    const { ethTxNonce } = input;

    const fuelProvider = new FuelProvider('http://localhost:4000/graphql');
    const fuelWallet: WalletUnlocked = Wallet.fromPrivateKey(
      '0x6303bacbe42085ab84211bba63f4946649bcfb81c30510cad46e6e4efbccbd72',
      fuelProvider
    );
    // TODO: what happens when has more than 1000 messages ? should we do pagination or something?
    const messages = await fuelProvider.getMessages(fuelWallet.address, {
      first: 1000,
    });
    const message = messages.find((message) => {
      return message.nonce.toHex() === ethTxNonce.toHex();
    });

    if (message) {
      return message;
    }

    return undefined;
  }
}
