import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type {
  BN,
  Provider as FuelProvider,
  MessageProof,
  ReceiptMessageOut,
} from 'fuels';
import { TransactionResponse, ReceiptType, Address } from 'fuels';

export type TxFuelToEthInputs = {
  create: {
    amount?: BN;
    fuelWallet?: FuelWalletLocked;
    ethAddress?: string;
  };
  getMessageId: {
    fuelTxId: string;
    fuelProvider?: FuelProvider;
  };
  getMessageProof: {
    fuelTxId: string;
    messageId: string;
    fuelProvider?: FuelProvider;
  };
  relayMessageFromFuelBlock: {
    messageProof: MessageProof;
  };
};

export class TxFuelToEthService {
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
    const txFuel = await fuelWallet.withdrawToBaseLayer(
      Address.fromString(ethAddress),
      amount
    );

    return txFuel.id;
  }

  static async getMessageId(input: TxFuelToEthInputs['getMessageId']) {
    if (!input?.fuelProvider) {
      throw new Error('Need to connect Fuel Provider');
    }
    if (!input?.fuelTxId) {
      throw new Error('Need transaction Id');
    }

    const { fuelTxId, fuelProvider } = input;

    const response = new TransactionResponse(fuelTxId || '', fuelProvider);
    const { receipts } = await response.waitForResult();
    // TODO: this should be replaced with tx utils getReceiptsMessageOut
    const message = receipts.find((r) => {
      return r.type === ReceiptType.MessageOut;
    }) as ReceiptMessageOut;

    return message?.messageID;
  }

  static async getMessageProof(input: TxFuelToEthInputs['getMessageProof']) {
    if (!input?.fuelProvider) {
      throw new Error('Need to connect Fuel Provider');
    }
    if (!input?.fuelTxId) {
      throw new Error('Need transaction Id');
    }
    if (!input?.messageId) {
      throw new Error('Need message ID');
    }

    const { fuelTxId, fuelProvider, messageId } = input;

    const withdrawMessageProof = await fuelProvider.getMessageProof(
      fuelTxId,
      messageId
    );

    return withdrawMessageProof;
  }

  static async relayMessageFromFuelBlock(
    input: TxFuelToEthInputs['relayMessageFromFuelBlock']
  ) {
    if (!input?.messageProof) {
      throw new Error('Need message proof to relay on ETH side');
    }

    // TODO: finish this part later as we need to mege changes in interactions with ETH side from Matt's PR
    // return undefined;
  }
}
