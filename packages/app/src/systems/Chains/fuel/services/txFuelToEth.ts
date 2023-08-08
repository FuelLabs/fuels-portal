import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type {
  BN,
  Provider as FuelProvider,
  MessageProof,
  ReceiptMessageOut,
  TransactionResultReceipt,
} from 'fuels';
import {
  bn,
  TransactionResponse,
  ReceiptType,
  Address,
  ZeroBytes32,
} from 'fuels';
import type { WalletClient } from 'viem';
import type { PublicClient as EthPublicClient } from 'wagmi';

import { FUEL_MESSAGE_PORTAL } from '../../eth/contracts/FuelMessagePortal';
import { TxEthToFuelService } from '../../eth/services';
import type { CommitBlockHeader } from '../../eth/types';
import { computeBlockHash } from '../../eth/utils/blockHash';
import type { RelayMessageParams } from '../../eth/utils/relayMessage';
import { createRelayMessageParams } from '../../eth/utils/relayMessage';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

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
  waitBlockCommit: {
    rootBlockHeader?: CommitBlockHeader;
    ethPublicClient: EthPublicClient;
  };
  waitBlockFinalization: {
    rootBlockHeader?: CommitBlockHeader;
    ethPublicClient: EthPublicClient;
  };
  getMessageRelayed: {
    messageProof: MessageProof;
    ethPublicClient: EthPublicClient;
    messageId: string;
  };
  relayMessageFromFuelBlock: {
    relayMessageParams: RelayMessageParams;
    ethWalletClient: WalletClient;
  };
  waitTxMessageRelayed: {
    txHash: `0x${string}`;
    ethPublicClient: EthPublicClient;
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
    // broken here in Sepolia only
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

    const withdrawMessageProof = await fuelProvider.getMessageProof(
      fuelTxId,
      messageId,
      fuelLastBlockId
    );

    if (!withdrawMessageProof) return undefined;

    return {
      withdrawMessageProof,
      relayMessageParams: createRelayMessageParams(withdrawMessageProof),
    };
  }

  static async waitBlockCommit(input: TxFuelToEthInputs['waitBlockCommit']) {
    if (!input?.rootBlockHeader) {
      throw new Error('Need root block header');
    }
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { rootBlockHeader, ethPublicClient } = input;

    const fuelChainState = TxEthToFuelService.connectToFuelChainState({
      publicClient: ethPublicClient,
    });
    const commitHashAtL1 = await fuelChainState.read.blockHashAtCommit([
      rootBlockHeader.height,
    ]);

    const isCommited = commitHashAtL1 !== ZeroBytes32;

    return isCommited;
  }

  static async waitBlockFinalization(
    input: TxFuelToEthInputs['waitBlockFinalization']
  ) {
    if (!input?.rootBlockHeader) {
      throw new Error('Need root block header');
    }
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { rootBlockHeader, ethPublicClient } = input;

    const fuelChainState = TxEthToFuelService.connectToFuelChainState({
      publicClient: ethPublicClient,
    });

    const isFinalized = await fuelChainState.read.finalized([
      computeBlockHash(rootBlockHeader),
      Number(bn(rootBlockHeader.height)),
    ]);

    return !!isFinalized;
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
    if (!input?.messageId) {
      throw new Error('Need message ID');
    }

    const { ethPublicClient } = input;

    const abiMessageRelayed = FUEL_MESSAGE_PORTAL.abi.find(
      ({ name, type }) => name === 'MessageRelayed' && type === 'event'
    );

    const logs = await ethPublicClient.getLogs({
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      event: {
        type: 'event',
        name: 'MessageRelayed',
        inputs: abiMessageRelayed?.inputs || [],
      },
      args: {
        messageId: input.messageId as `0x${string}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      fromBlock: 'earliest',
    });

    return logs?.[0]?.transactionHash || undefined;
  }

  static async relayMessageFromFuelBlock(
    input: TxFuelToEthInputs['relayMessageFromFuelBlock']
  ) {
    if (!input?.relayMessageParams) {
      throw new Error('Need relay message params');
    }

    if (!input?.ethWalletClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { relayMessageParams, ethWalletClient } = input;

    const fuelPortal = TxEthToFuelService.connectToFuelMessagePortal({
      walletClient: ethWalletClient,
    });

    const txHash = await fuelPortal.write.relayMessage([
      relayMessageParams.message,
      relayMessageParams.rootBlockHeader,
      relayMessageParams.blockHeader,
      relayMessageParams.blockInHistoryProof,
      relayMessageParams.messageInBlockProof,
    ]);

    return txHash;
  }

  static async waitTxMessageRelayed(
    input: TxFuelToEthInputs['waitTxMessageRelayed']
  ) {
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.txHash) {
      throw new Error('Need transaction hash');
    }

    const { ethPublicClient, txHash } = input;

    const txReceipts = await ethPublicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return !!txReceipts;
  }
}
