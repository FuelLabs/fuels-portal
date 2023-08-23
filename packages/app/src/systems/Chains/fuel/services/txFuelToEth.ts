import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import type {
  BN,
  Provider as FuelProvider,
  MessageProof,
  TransactionResultReceipt,
} from 'fuels';
import {
  bn,
  TransactionResponse,
  Address,
  ZeroBytes32,
  getReceiptsMessageOut,
} from 'fuels';
import type { WalletClient } from 'viem';
import type { PublicClient as EthPublicClient } from 'wagmi';

import { FUEL_MESSAGE_PORTAL } from '../../eth/contracts/FuelMessagePortal';
import { TxEthToFuelService } from '../../eth/services';
import { createRelayMessageParams } from '../../eth/utils/relayMessage';
import type { Block } from '../utils';
import { getBlock } from '../utils';

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
    rootBlockHeight?: BN;
    ethPublicClient: EthPublicClient;
    fuelProvider?: FuelProvider;
  };
  waitBlockFinalization: {
    fuelBlockCommited?: Block;
    ethPublicClient: EthPublicClient;
  };
  getMessageRelayed: {
    messageProof: MessageProof;
    ethPublicClient: EthPublicClient;
    messageId: string;
  };
  relayMessageFromFuelBlock: {
    messageProof: MessageProof;
    fuelBlockCommited: Block;
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
    const gasLimit = (await fuelWallet.provider.getChain()).consensusParameters
      .maxGasPerTx;
    const txFuel = await fuelWallet.withdrawToBaseLayer(
      Address.fromString(ethAddress),
      amount,
      // TODO: remove this once fuel-core is fixed (max_gas considering metered_bytes as well)
      {
        gasLimit: gasLimit.sub(10_000).toNumber(),
      }
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

    if (
      !currentBlock ||
      chain.latestBlock.height.lte(bn(currentBlock?.height))
    ) {
      return undefined;
    }

    // get only the next block, instead of latest one
    const nextBlock = await fuelProvider.getBlock(
      currentBlock.height.add(1).toNumber()
    );

    return nextBlock?.id || undefined;
  }

  static async getMessageId(input: TxFuelToEthInputs['getMessageId']) {
    if (!input?.receipts) {
      throw new Error('Need receipts from tx result');
    }
    const { receipts } = input;

    const message = getReceiptsMessageOut(receipts)[0];

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

    return withdrawMessageProof || undefined;
  }

  static async waitBlockCommit(input: TxFuelToEthInputs['waitBlockCommit']) {
    if (!input?.rootBlockHeight) {
      throw new Error('Need root block height');
    }
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.fuelProvider) {
      throw new Error('Need to connect Fuel Provider');
    }

    const { rootBlockHeight, ethPublicClient, fuelProvider } = input;

    const fuelChainState = TxEthToFuelService.connectToFuelChainState({
      publicClient: ethPublicClient,
    });

    console.log(`fuel block height`, rootBlockHeight.toNumber());
    // TODO: remove this when FuelChainState.blockHashAtCommit handle this calculation. for now forcing it here to bypass
    const blocksPerCommitInterval =
      (await fuelChainState.read.BLOCKS_PER_COMMIT_INTERVAL()) as bigint;
    const workaroundHeight = rootBlockHeight.div(
      Number(blocksPerCommitInterval)
    );

    console.log(`blocksPerCommitInterval`, blocksPerCommitInterval);
    console.log(`rootBlockHeight.toNumber()`, rootBlockHeight.toNumber());
    console.log(`workaroundHeight`, workaroundHeight.toNumber());

    const blockHashAtFuel = await fuelChainState.read.blockHashAtCommit([
      workaroundHeight,
    ]);
    const isCommited = blockHashAtFuel !== ZeroBytes32;
    console.log(`isCommited`, isCommited);

    if (!isCommited) return undefined;

    console.log(`blockHashAtFuel`, blockHashAtFuel);
    const blockCommited = await getBlock({
      blockHash: blockHashAtFuel as string,
      providerUrl: fuelProvider.url,
    });

    console.log(`blockCommited`, blockCommited);

    return blockCommited;
  }

  static async waitBlockFinalization(
    input: TxFuelToEthInputs['waitBlockFinalization']
  ) {
    if (!input?.fuelBlockCommited) {
      throw new Error('Need block commited on Fuel');
    }
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    const { ethPublicClient, fuelBlockCommited } = input;

    const fuelChainState = TxEthToFuelService.connectToFuelChainState({
      publicClient: ethPublicClient,
    });

    console.log(`fuelBlockCommited.id`, fuelBlockCommited.id);
    console.log(
      `fuelBlockCommited.header.height`,
      fuelBlockCommited.header.height
    );

    const isFinalized = await fuelChainState.read.finalized([
      fuelBlockCommited.id,
      bn(fuelBlockCommited.header.height).toNumber(),
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
    if (!input?.ethWalletClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.fuelBlockCommited) {
      throw new Error('Need block commited on Fuel');
    }
    if (!input?.messageProof) {
      throw new Error('Need message proof to relay on ETH side');
    }

    const { messageProof, fuelBlockCommited, ethWalletClient } = input;

    const relayMessageParams = await createRelayMessageParams({
      withdrawMessageProof: messageProof,
      fuelBlockCommited,
    });

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
