import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type { Signer as EthSigner } from 'ethers';
import type {
  BN,
  Provider as FuelProvider,
  TransactionResponse as FuelTransactionResponse,
} from 'fuels';
import { Address, bn } from 'fuels';

import { FuelMessagePortal__factory } from '../../eth/fuel-v2-contracts/factories/FuelMessagePortal__factory';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export type TxFuelToEthInputs = {
  create: {
    amount?: BN;
    fuelWallet?: FuelWalletLocked;
    ethAddress?: string;
  };
  getDepositNonce: {
    fuelTx?: FuelTransactionResponse;
    fuelProvider?: FuelProvider;
  };
};

export class TxFuelToEthService {
  static connectToFuelMessagePortal(
    signerOrProvider: EthSigner | FuelProvider
  ) {
    return FuelMessagePortal__factory.connect(
      VITE_ETH_FUEL_MESSAGE_PORTAL,
      signerOrProvider
    );
  }

  static async create(input: TxFuelToEthInputs['create']) {
    if (!input?.fuelWallet) {
      throw new Error('Need to connect Fuel Wallet');
    }
    if (!input?.amount || input?.amount?.isZero()) {
      throw new Error('Need amount to send');
    }
    if (!input?.ethAddress) {
      throw new Error('Need ETH address to send');
    }

    const { amount, fuelWallet, ethAddress } = input;
    debugger;
    const txFuel = await fuelWallet.withdrawToBaseLayer(
      Address.fromString(ethAddress),
      amount
    );

    return txFuel.id;
  }

  static async getDepositNonce(input: TxFuelToEthInputs['getDepositNonce']) {
    if (!input?.fuelTx) {
      throw new Error('No fuel TX');
    }
    if (!input?.fuelProvider) {
      throw new Error('No fuel Provider');
    }

    const { fuelProvider, fuelTx } = input;
    const fuelPortal =
      TxFuelToEthService.connectToFuelMessagePortal(fuelProvider);

    const receipt = await fuelTx.wait();
    const event = fuelPortal.interface.parseLog(receipt.logs[0]);
    const depositNonce = bn(event.args.nonce.toHexString());

    return depositNonce;
  }
}
