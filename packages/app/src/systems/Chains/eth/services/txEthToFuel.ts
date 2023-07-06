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
import {
  decodeEventLog,
  getContract,
  getContractAddress,
  isAddress,
} from 'viem';
import type { PublicClient } from 'wagmi';

import { ETH_CHAIN } from '../../config';
import { ERC_20 } from '../contracts/Erc20';
import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';
import { ETH_UNITS } from '../utils';

import {
  VITE_ETH_ERC20_TOKEN_ADDRESS,
  VITE_ETH_FUEL_ERC20_GATEWAY,
  VITE_ETH_FUEL_MESSAGE_PORTAL,
} from '~/config';
import type { BridgeAsset } from '~/systems/Bridge';

export type TxEthToFuelInputs = {
  start: {
    amount: string;
    ethWalletClient?: WalletClient;
    fuelAddress?: FuelAddress;
    ethAsset?: BridgeAsset;
    ethPublicClient?: PublicClient;
  };
  createErc20Contract: {
    ethWalletClient?: WalletClient;
    ethPublicClient?: PublicClient;
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

  // TODO: should remove this method when l1_chain creates erc20 contract by itself
  static async createErc20Contract(
    input: TxEthToFuelInputs['createErc20Contract']
  ) {
    if (ETH_CHAIN.name !== 'Foundry') return;

    if (!input?.ethWalletClient) {
      throw new Error('Need to connect ETH Wallet');
    }

    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Provider');
    }

    const { ethWalletClient, ethPublicClient } = input;
    if (ethWalletClient.account) {
      try {
        const balance = await ethPublicClient.readContract({
          address: VITE_ETH_ERC20_TOKEN_ADDRESS,
          abi: ERC_20.abi,
          functionName: 'balanceOf',
          args: [ethWalletClient.account.address],
        });

        if (!balance) {
          // mint tokens as starting balances
          console.log(`Minting ERC-20 tokens to test with...`);
          await ethWalletClient.writeContract({
            address: VITE_ETH_ERC20_TOKEN_ADDRESS,
            abi: ERC_20.abi,
            functionName: 'mint',
            account: ethWalletClient.account,
            chain: ETH_CHAIN,
            args: [
              ethWalletClient.account.address,
              bn.parseUnits('1000', ETH_UNITS),
            ],
          });
        }
      } catch (e) {
        const hash = await ethWalletClient.deployContract({
          abi: ERC_20.abi,
          account: ethWalletClient.account,
          chain: ETH_CHAIN,
          bytecode: ERC_20.hashcode,
        });

        const transaction = await ethPublicClient.getTransaction({ hash });

        const erc20Address = await getContractAddress({
          from: ethWalletClient.account.address,
          nonce: BigInt(transaction.nonce),
        });

        console.log(
          `Ethereum ERC-20 token contract created at address ${erc20Address}. now replace it in env file.`
        );
      }
    }
  }

  static async start(input: TxEthToFuelInputs['start']) {
    if (!input?.ethWalletClient?.account || !input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.amount) {
      throw new Error('Need amount to send');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need fuel address to send');
    }
    if (!input?.ethAsset) {
      throw new Error('Need ETH asset');
    }

    const { ethWalletClient, fuelAddress, amount, ethAsset, ethPublicClient } =
      input;

    try {
      // only tokens will have address, as eth is native
      if (isAddress(ethAsset.address)) {
        const fuelErc20Gateway = TxEthToFuelService.connectToFuelErc20Gateway({
          walletClient: ethWalletClient,
        });
        const erc20Token = TxEthToFuelService.connectToErc20({
          address: ethAsset.address,
          walletClient: ethWalletClient,
        });

        const approveTxHash = await erc20Token.write.approve(
          [VITE_ETH_FUEL_ERC20_GATEWAY as `0x${string}`],
          {
            value: BigInt(amount),
            account: ethWalletClient.account,
          }
        );

        const approveTxHashReceipt =
          await ethPublicClient.getTransactionReceipt({ hash: approveTxHash });
        if (approveTxHashReceipt.status !== 'success') {
          throw new Error('Failed to approve Token for transfer');
        }

        //
        // TODO: need to split this part in 2 to be able to redo it in case if failed (status !== success) for both transactions
        //

        // TODO: fix token in side fuel? how can we know it?
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
      } else {
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
