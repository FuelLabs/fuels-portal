import type { TransactionResponse as EthTransactionResponse } from '@ethersproject/providers';
import type {
  Address as FuelAddress,
  BN,
  Provider as FuelProvider,
} from 'fuels';
import { bn } from 'fuels';
import type { WalletClient } from 'viem';
import { decodeEventLog, getContract, isAddress } from 'viem';
import type { PublicClient } from 'wagmi';

import { ERC_20 } from '../contracts/Erc20';
import { FUEL_CHAIN_STATE } from '../contracts/FuelChainState';
import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';

import {
  VITE_ETH_FUEL_CHAIN_STATE,
  VITE_ETH_FUEL_ERC20_GATEWAY,
  VITE_ETH_FUEL_MESSAGE_PORTAL,
} from '~/config';
import type { BridgeAsset } from '~/systems/Bridge';

export type TxEthToFuelInputs = {
  startEth: {
    amount: string;
    ethWalletClient?: WalletClient;
    fuelAddress?: FuelAddress;
    ethPublicClient?: PublicClient;
  };
  startErc20: {
    ethAsset?: BridgeAsset;
  } & TxEthToFuelInputs['startEth'];
  createErc20Contract: {
    ethWalletClient?: WalletClient;
    ethPublicClient?: PublicClient;
  };
  getDepositNonce: {
    ethTx?: EthTransactionResponse;
    ethPublicClient?: PublicClient;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
    fuelProvider?: FuelProvider;
    fuelAddress?: FuelAddress;
  };
};

export class TxEthToFuelService {
  static connectToFuelErc20Gateway(options: {
    walletClient?: WalletClient;
    publicClient?: PublicClient;
  }) {
    const { walletClient, publicClient } = options;

    const contract = getContract({
      abi: ERC_20.abi,
      address: VITE_ETH_FUEL_ERC20_GATEWAY as `0x${string}`,
      walletClient,
      publicClient,
    });

    return contract;
  }

  static connectToFuelMessagePortal(options: {
    walletClient?: WalletClient;
    publicClient?: PublicClient;
  }) {
    const { walletClient, publicClient } = options;

    const contract = getContract({
      abi: FUEL_MESSAGE_PORTAL.abi,
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      walletClient,
      publicClient,
    });

    return contract;
  }

  static connectToErc20(options: {
    walletClient?: WalletClient;
    publicClient?: PublicClient;
    address: `0x${string}`;
  }) {
    const { walletClient, publicClient, address } = options;

    const contract = getContract({
      abi: ERC_20.abi,
      address,
      walletClient,
      publicClient,
    });

    return contract;
  }

  static connectToFuelChainState(options: {
    walletClient?: WalletClient;
    publicClient?: PublicClient;
  }) {
    const { walletClient, publicClient } = options;

    const contract = getContract({
      abi: FUEL_CHAIN_STATE.abi,
      address: VITE_ETH_FUEL_CHAIN_STATE as `0x${string}`,
      walletClient,
      publicClient,
    });

    return contract;
  }

  static assertStartEth(input: TxEthToFuelInputs['startEth']) {
    if (!input?.ethWalletClient?.account || !input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.amount) {
      throw new Error('Need amount to send');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need fuel address to send');
    }
  }

  static assertStartErc20(input: TxEthToFuelInputs['startErc20']) {
    TxEthToFuelService.assertStartEth(input);
    if (!input?.ethAsset) {
      throw new Error('Need ETH asset');
    }
    if (
      !input?.ethAsset?.address?.startsWith('0x') ||
      !isAddress(input.ethAsset.address)
    ) {
      throw new Error('Not valid ETH asset');
    }
  }

  static async start(input: TxEthToFuelInputs['startErc20']) {
    if (input?.ethAsset?.address && isAddress(input.ethAsset.address)) {
      return TxEthToFuelService.startErc20(input);
    }

    return TxEthToFuelService.startEth(input);
  }

  static async startEth(input: TxEthToFuelInputs['startEth']) {
    TxEthToFuelService.assertStartEth(input);

    try {
      const { ethWalletClient, fuelAddress, amount } = input;
      if (fuelAddress && ethWalletClient) {
        const fuelPortal = TxEthToFuelService.connectToFuelMessagePortal({
          walletClient: ethWalletClient,
        });

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
        throw new Error('Wallet owner rejected this transaction.');
      }

      throw e;
    }

    return undefined;
  }

  static async startErc20(input: TxEthToFuelInputs['startErc20']) {
    TxEthToFuelService.assertStartErc20(input);

    try {
      const {
        ethWalletClient,
        fuelAddress,
        amount,
        ethAsset,
        ethPublicClient,
      } = input;

      if (
        ethAsset?.address &&
        ethWalletClient &&
        fuelAddress &&
        ethPublicClient
      ) {
        const fuelErc20Gateway = TxEthToFuelService.connectToFuelErc20Gateway({
          walletClient: ethWalletClient,
        });
        const erc20Token = TxEthToFuelService.connectToErc20({
          address: ethAsset.address as `0x${string}`,
          walletClient: ethWalletClient,
        });

        const approveTxHash = await erc20Token.write.approve([
          VITE_ETH_FUEL_ERC20_GATEWAY as `0x${string}`,
          amount,
        ]);

        const approveTxHashReceipt =
          await ethPublicClient.getTransactionReceipt({ hash: approveTxHash });

        if (approveTxHashReceipt.status !== 'success') {
          throw new Error('Failed to approve Token for transfer');
        }

        // TODO: continue here
        const fuelTokenId = 'fuel';
        const depositTxHash = await fuelErc20Gateway.write.deposit(
          [
            fuelAddress.toB256() as `0x${string}`,
            ethAsset.address,
            fuelTokenId,
          ],
          {
            value: BigInt(amount),
            account: ethWalletClient.account,
          }
        );
        const depositTxHashReceipt =
          await ethPublicClient.getTransactionReceipt({ hash: depositTxHash });
        if (depositTxHashReceipt.status !== 'success') {
          throw new Error('Failed to deposit Token');
        }
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.code === 'ACTION_REJECTED') {
        throw new Error('Wallet owner rejected this transaction.');
      }

      throw e;
    }

    return undefined;
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
      // workaround in place because waitForTransactionReceipt stop working after first time using it
      receipt = await ethPublicClient.waitForTransactionReceipt({
        hash: ethTx.hash as `0x${string}`,
      });
    }

    const decodedEvent = decodeEventLog({
      abi: FUEL_MESSAGE_PORTAL.abi,
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
    const messages = await fuelProvider.getMessages(fuelAddress);
    const message = messages.find(
      (message) => message.nonce.toString() === ethTxNonce.toHex(32).toString()
    );

    return message || undefined;
  }
}
