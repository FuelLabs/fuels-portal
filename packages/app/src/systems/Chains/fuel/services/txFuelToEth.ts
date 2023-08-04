import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type {
  BN,
  Provider as FuelProvider,
  MessageProof,
  ReceiptMessageOut,
  TransactionResultReceipt,
} from 'fuels';
import { bn, TransactionResponse, ReceiptType, Address } from 'fuels';
import type { WalletClient, PublicClient as EthPublicClient } from 'viem';

import type { BlockHeader, MessageOutput } from '../../eth';
import { TxEthToFuelService } from '../../eth';

export type TxFuelToEthInputs = {
  create: {
    amount?: BN;
    fuelWallet?: FuelWalletLocked;
    ethAddress?: string;
  };
  waitTxResult: {
    fuelTxId: string;
    fuelProvider?: FuelProvider;
  };
  waitNextBlock: {
    fuelProvider?: FuelProvider;
    blockId: string;
  };
  getMessageId: {
    receipts: TransactionResultReceipt[];
  };
  getMessageProof: {
    fuelTxId: string;
    messageId: string;
    fuelProvider?: FuelProvider;
    fuelLastBlockId?: string;
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
    // TODO: broken here
    const txFuel = await fuelWallet.withdrawToBaseLayer(
      Address.fromString(ethAddress),
      amount
    );

    return txFuel.id;
  }

  static async waitTxResult(input: TxFuelToEthInputs['waitTxResult']) {
    if (!input?.fuelProvider) {
      throw new Error('Need to connect Fuel Provider');
    }
    if (!input?.fuelTxId) {
      throw new Error('Need transaction Id');
    }

    const { fuelTxId, fuelProvider } = input;

    const response = new TransactionResponse(fuelTxId || '', fuelProvider);
    const result = await response.waitForResult();

    return result;
  }

  static async waitNextBlock(input: TxFuelToEthInputs['waitNextBlock']) {
    if (!input?.fuelProvider) {
      throw new Error('Need to connect Fuel Provider');
    }
    if (!input?.blockId) {
      throw new Error('Need block Id');
    }

    const { fuelProvider, blockId } = input;

    const chain = await fuelProvider.getChain();
    const currentBlock = await fuelProvider.getBlock(blockId);

    if (chain.latestBlock.height.lte(bn(currentBlock?.height))) {
      return undefined;
    }

    return chain.latestBlock.id;
  }

  static async getMessageId(input: TxFuelToEthInputs['getMessageId']) {
    if (!input?.receipts) {
      throw new Error('Need receipts from tx result');
    }
    const { receipts } = input;

    // TODO: this should be replaced with tx utils getReceiptsMessageOut
    const message = receipts.find((r) => {
      return r.type === ReceiptType.MessageOut;
    }) as ReceiptMessageOut;

    return message?.messageId;
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
    if (!input?.fuelLastBlockId) {
      throw new Error('Need last block ID');
    }

    const { fuelTxId, fuelProvider, messageId, fuelLastBlockId } = input;

    // TODO: here should pass blockCommitId blockCommitHeight after we have new structure for bridge
    const withdrawMessageProof = await fuelProvider.getMessageProof(
      fuelTxId,
      messageId,
      fuelLastBlockId
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

    // TODO: implement logic to identify relayed transaction/event in eth side
    // const { messageProof, ethPublicClient } = input;

    // const logs = await ethPublicClient.getLogs({
    //   address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
    //   // TODO: put correct filters to get event messageRelayed (when it gets added)
    //   fromBlock: 'earliest',
    // });

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

    // TODO: this BlockHeader in ETH side probably changed with new infra, check
    const blockHeader: BlockHeader = {
      prevRoot: messageProof.messageBlockHeader.prevRoot,
      height: messageProof.messageBlockHeader.height.toHex(),
      timestamp: bn(messageProof.messageBlockHeader.time).toHex(),
      daHeight: messageProof.messageBlockHeader.daHeight.toHex(),
      txCount: messageProof.messageBlockHeader.transactionsCount.toHex(),
      outputMessagesCount:
        messageProof.messageBlockHeader.messageReceiptCount.toHex(),
      txRoot: messageProof.messageBlockHeader.transactionsRoot,
      outputMessagesRoot: messageProof.messageBlockHeader.messageReceiptRoot,
    };
    const messageInBlockProof = {
      key: Number(messageProof.messageProof.proofIndex.toString()),
      proof: messageProof.messageProof.proofSet.slice(0, -1),
    };

    const fuelPortal = TxEthToFuelService.connectToFuelMessagePortal({
      walletClient: ethWalletClient,
    });
    const txHash = await fuelPortal.write.relayMessageFromFuelBlock([
      messageOutput,
      blockHeader,
      messageInBlockProof,
      // TODO: what is the signature with new infra?
      // messageProof.signature,
    ]);

    return txHash;
  }
}
