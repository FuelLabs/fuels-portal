import type {
  Provider as EthProvider,
  TransactionResponse as EthTransactionResponse,
} from '@ethersproject/providers';
import type { Signer as EthSigner } from 'ethers';
import type {
  Address as FuelAddress,
  BN,
  Provider as FuelProvider,
} from 'fuels';
import { bn } from 'fuels';

import { FuelMessagePortal__factory } from '../fuel-v2-contracts/factories/FuelMessagePortal__factory';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export type TxEthToFuelInputs = {
  create: {
    amount: string;
    ethSigner?: EthSigner;
    fuelAddress?: FuelAddress;
  };
  getDepositNonce: {
    ethTx?: EthTransactionResponse;
    ethProvider?: EthProvider;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
    fuelProvider?: FuelProvider;
    fuelAddress?: FuelAddress;
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
    if (!input?.ethSigner) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.amount) {
      throw new Error('Need amount to send');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need fuel address to send');
    }

    const { ethSigner, fuelAddress, amount } = input;
    const fuelPortal = TxEthToFuelService.connectToFuelMessagePortal(ethSigner);

    try {
      const tx = await fuelPortal.depositETH(fuelAddress.toB256(), {
        value: amount,
      });

      return tx.hash;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.code === 'ACTION_REJECTED') {
        throw new Error('Transaction not approved by wallet owner');
      }

      throw e;
    }
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
    if (!input?.fuelProvider) {
      throw new Error('No provider for Fuel informed');
    }
    if (!input?.fuelAddress) {
      throw new Error('No address for Fuel informed');
    }
    const { ethTxNonce, fuelProvider, fuelAddress } = input;

    // TODO: what happens when has more than 1000 messages ? should we do pagination or something?
    const messages = await fuelProvider.getMessages(fuelAddress, {
      first: 1000,
    });
    const message = messages.find(
      (message) => message.nonce.toHex() === ethTxNonce.toHex()
    );

    if (message) {
      return message;
    }

    return undefined;
  }
}
