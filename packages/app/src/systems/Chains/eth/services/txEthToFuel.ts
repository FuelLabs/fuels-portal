import type {
  Provider as EthProvider,
  TransactionResponse as EthTransactionResponse,
} from '@ethersproject/providers';
import type {
  Address as FuelAddress,
  BN,
  Provider as FuelProvider,
} from 'fuels';
import { bn } from 'fuels';
import type { WalletClient } from 'viem';
import { decodeEventLog, getContract } from 'viem';
import type { PublicClient } from 'wagmi';

import { AbiFuelMessagePortal } from './abi';

import { VITE_ETH_FUEL_MESSAGE_PORTAL } from '~/config';

export type TxEthToFuelInputs = {
  create: {
    amount: string;
    ethWalletClient?: WalletClient;
    fuelAddress?: FuelAddress;
  };
  getDepositNonce: {
    ethTx?: EthTransactionResponse;
    ethProvider?: EthProvider;
    ethPublicClient?: PublicClient;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
    fuelProvider?: FuelProvider;
    fuelAddress?: FuelAddress;
  };
};

export class TxEthToFuelService {
  static connectToFuelMessagePortal(
    walletClient?: WalletClient,
    publicClient?: PublicClient
  ) {
    const contract = getContract({
      abi: AbiFuelMessagePortal,
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      walletClient,
      publicClient,
    });

    return contract;
  }

  static async create(input: TxEthToFuelInputs['create']) {
    if (!input?.ethWalletClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.amount) {
      throw new Error('Need amount to send');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need fuel address to send');
    }

    const { ethWalletClient, fuelAddress, amount } = input;

    try {
      if (ethWalletClient.account) {
        const fuelPortal =
          TxEthToFuelService.connectToFuelMessagePortal(ethWalletClient);

        const txHash = await fuelPortal.write.depositETH(
          [fuelAddress.toB256() as `0x${string}`],
          {
            value: BigInt(amount),
            account: ethWalletClient.account,
          }
        );

        return txHash;
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.code === 'ACTION_REJECTED') {
        throw new Error('Transaction not approved by wallet owner');
      }

      throw e;
    }
    return '0x';
  }

  static async getDepositNonce(input: TxEthToFuelInputs['getDepositNonce']) {
    if (!input?.ethTx) {
      throw new Error('No eth TX');
    }
    if (!input?.ethPublicClient) {
      throw new Error('No eth Provider');
    }

    const { ethTx, ethPublicClient } = input;

    let receipt;
    try {
      receipt = await ethPublicClient.getTransactionReceipt({
        hash: ethTx.hash as `0x${string}`,
      });
    } catch (err: unknown) {
      receipt = await ethPublicClient.waitForTransactionReceipt({
        hash: ethTx.hash as `0x${string}`,
        timeout: 10_000,
      });
    }
    const decodedEvent = decodeEventLog({
      abi: AbiFuelMessagePortal,
      data: receipt.logs[0].data,
      topics: receipt.logs[0].topics,
    }) as unknown as { args: { nonce: number } };
    const depositNonce = bn(decodedEvent.args.nonce);
    return depositNonce;
  }

  static async getFuelMessage(input: TxEthToFuelInputs['getFuelMessage']) {
    if (!input?.ethTxNonce) {
      throw new Error('No nonce found');
    }
    if (!input?.fuelProvider) {
      throw new Error('No provider for Fuel found');
    }
    if (!input?.fuelAddress) {
      throw new Error('No address for Fuel found');
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
