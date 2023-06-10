import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type {
  BN,
  Provider as FuelProvider,
  MessageProof,
  ReceiptMessageOut,
} from 'fuels';
import { bn, TransactionResponse, ReceiptType, Address } from 'fuels';
import type { WalletClient, PublicClient as EthPublicClient } from 'viem';

import type { BlockHeader, MessageOutput } from '../../eth';
import { TxEthToFuelService } from '../../eth';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

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
  getMessageRelayed: {
    messageProof: MessageProof;
    ethPublicClient: EthPublicClient;
  };
  relayMessageFromFuelBlock: {
    messageProof: MessageProof;
    ethWalletClient: WalletClient;
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

  static async getMessageRelayed(
    input: TxFuelToEthInputs['getMessageRelayed']
  ) {
    if (!input?.messageProof) {
      throw new Error('Need message proof to relay on ETH side');
    }

    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { messageProof, ethPublicClient } = input;

    const logs = await ethPublicClient.getLogs({
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      // TODO: put correct filters to get event messageRelayed (when it gets added)
      fromBlock: 'earliest',
    });

    return undefined;
  }

  static async relayMessageFromFuelBlock(
    input: TxFuelToEthInputs['relayMessageFromFuelBlock']
  ) {
    if (!input?.messageProof) {
      throw new Error('Need message proof to relay on ETH side');
    }

    if (!input?.ethWalletClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { messageProof, ethWalletClient } = input;

    const messageOutput: MessageOutput = {
      sender: messageProof.sender.toHexString(),
      recipient: messageProof.recipient.toHexString(),
      amount: messageProof.amount.toHex(),
      nonce: messageProof.nonce,
      data: messageProof.data,
    };
    const blockHeader: BlockHeader = {
      prevRoot: messageProof.header.prevRoot,
      height: messageProof.header.height.toHex(),
      timestamp: bn(messageProof.header.time).toHex(),
      daHeight: messageProof.header.daHeight.toHex(),
      txCount: messageProof.header.transactionsCount.toHex(),
      outputMessagesCount: messageProof.header.outputMessagesCount.toHex(),
      txRoot: messageProof.header.transactionsRoot,
      outputMessagesRoot: messageProof.header.outputMessagesRoot,
    };
    const messageInBlockProof = {
      key: Number(messageProof.proofIndex.toString()),
      proof: messageProof.proofSet.slice(0, -1),
    };

    const fuelPortal =
      TxEthToFuelService.connectToFuelMessagePortal(ethWalletClient);

    const txHash = await fuelPortal.write.relayMessageFromFuelBlock([
      messageOutput,
      blockHeader,
      messageInBlockProof,
      messageProof.signature,
    ]);

    return txHash;
  }
}
