import type { TransactionResponse as EthTransactionResponse } from '@ethersproject/providers';
import type {
  BN,
  Provider as FuelProvider,
  Message,
  TransactionRequestLike,
  WalletUnlocked as FuelWallet,
} from 'fuels';
import { Address as FuelAddress, bn } from 'fuels';
import type { WalletClient } from 'viem';
import { decodeEventLog } from 'viem';
import type { PublicClient } from 'wagmi';
import type { FetchTokenResult } from 'wagmi/actions';
import { fetchToken } from 'wagmi/actions';

import { FUEL_UNITS } from '../../fuel/utils/chain';
import { relayCommonMessage } from '../../fuel/utils/relayMessage';
import type { FuelERC20GatewayArgs } from '../contracts/FuelErc20Gateway';
import { FUEL_ERC_20_GATEWAY } from '../contracts/FuelErc20Gateway';
import type { FuelMessagePortalArgs } from '../contracts/FuelMessagePortal';
import { FUEL_MESSAGE_PORTAL } from '../contracts/FuelMessagePortal';
import { isErc20Address } from '../utils';

import { EthConnectorService } from './connectors';

import {
  VITE_ETH_FUEL_ERC20_GATEWAY,
  VITE_FUEL_TOKEN_CONTRACT_ID,
} from '~/config';
import type { BridgeAsset } from '~/systems/Bridge';

export type TxEthToFuelInputs = {
  startEth: {
    amount: string;
    fuelAddress?: FuelAddress;
    ethWalletClient?: WalletClient;
    ethPublicClient?: PublicClient;
  };
  startErc20: {
    ethAsset?: BridgeAsset;
  } & TxEthToFuelInputs['startEth'];
  createErc20Contract: {
    ethWalletClient?: WalletClient;
    ethPublicClient?: PublicClient;
    ethAsset?: BridgeAsset;
  };
  getReceiptsInfo: {
    ethTx?: EthTransactionResponse;
    ethPublicClient?: PublicClient;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
    fuelProvider?: FuelProvider;
    fuelRecipient?: FuelAddress;
  };
  relayMessageOnFuel: {
    fuelWallet?: FuelWallet;
    fuelMessage?: Message;
    txParams?: Pick<
      TransactionRequestLike,
      'gasLimit' | 'gasPrice' | 'maturity'
    >;
  };
};

export type GetReceiptsInfoReturn = {
  erc20Token?: FetchTokenResult;
  amount?: string;
  sender?: string;
  recipient?: FuelAddress;
  nonce?: BN;
};

export class TxEthToFuelService {
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
      !isErc20Address(input.ethAsset.address)
    ) {
      throw new Error('Not valid ETH asset');
    }
  }

  static async start(input: TxEthToFuelInputs['startErc20']) {
    if (isErc20Address(input?.ethAsset?.address)) {
      return TxEthToFuelService.startErc20(input);
    }

    return TxEthToFuelService.startEth(input);
  }

  static async startEth(input: TxEthToFuelInputs['startEth']) {
    TxEthToFuelService.assertStartEth(input);

    try {
      const { ethWalletClient, fuelAddress, amount } = input;
      if (fuelAddress && ethWalletClient) {
        const fuelPortal = EthConnectorService.connectToFuelMessagePortal({
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
        isErc20Address(ethAsset?.address) &&
        ethWalletClient &&
        fuelAddress &&
        ethPublicClient
      ) {
        const fuelErc20Gateway = EthConnectorService.connectToFuelErc20Gateway({
          walletClient: ethWalletClient,
        });
        const erc20Token = EthConnectorService.connectToErc20({
          address: ethAsset?.address as `0x${string}`,
          walletClient: ethWalletClient,
        });

        const approveTxHash = await erc20Token.write.approve([
          VITE_ETH_FUEL_ERC20_GATEWAY,
          amount,
        ]);

        const approveTxHashReceipt =
          await ethPublicClient.getTransactionReceipt({ hash: approveTxHash });

        if (approveTxHashReceipt.status !== 'success') {
          throw new Error('Failed to approve Token for transfer');
        }

        const depositTxHash = await fuelErc20Gateway.write.deposit([
          fuelAddress.toB256() as `0x${string}`,
          ethAsset?.address,
          FuelAddress.fromString(VITE_FUEL_TOKEN_CONTRACT_ID).toB256(),
          amount,
        ]);

        return depositTxHash;
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

  static async getReceiptsInfo(
    input: TxEthToFuelInputs['getReceiptsInfo']
  ): Promise<GetReceiptsInfoReturn> {
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

    if (receipt.status !== 'success') {
      throw new Error('Failed to deposit Token');
    }

    let receiptsInfo: GetReceiptsInfoReturn = {};

    // try to get messageSent event from logs, for deposit ETH operation
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < receipt.logs.length; i++) {
      try {
        const messageSentEvent = decodeEventLog({
          abi: FUEL_MESSAGE_PORTAL.abi,
          data: receipt.logs[i].data,
          topics: receipt.logs[i].topics,
        }) as unknown as { args: FuelMessagePortalArgs['MessageSent'] };

        const { amount, sender, nonce, recipient } = messageSentEvent.args;
        receiptsInfo = {
          ...receiptsInfo,
          nonce: bn(nonce.toString()),
          amount: bn(amount.toString()).format({ precision: FUEL_UNITS }),
          sender,
          recipient: FuelAddress.fromB256(recipient),
        };
      } catch (_) {
        /* empty */
      }
    }

    // try to get depositSent event from logs, for deposit ERC-20 operation
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < receipt.logs.length; i++) {
      try {
        const depositEvent = decodeEventLog({
          abi: FUEL_ERC_20_GATEWAY.abi,
          data: receipt.logs[i].data,
          topics: receipt.logs[i].topics,
        }) as unknown as { args: FuelERC20GatewayArgs['Deposit'] };

        if (isErc20Address(depositEvent.args.tokenId)) {
          const { amount, sender, tokenId } = depositEvent.args;
          const erc20Token = await fetchToken({
            address: tokenId,
          });

          receiptsInfo = {
            ...receiptsInfo,
            erc20Token,
            amount: bn(amount.toString()).format({
              units: erc20Token.decimals,
              precision: FUEL_UNITS,
            }),
            sender,
          };
        }
      } catch (_) {
        /* empty */
      }
    }

    return receiptsInfo;
  }

  static async getFuelMessage(input: TxEthToFuelInputs['getFuelMessage']) {
    if (!input?.ethTxNonce) {
      throw new Error('No nonce found');
    }
    if (!input?.fuelProvider) {
      throw new Error('No provider for Fuel found');
    }
    if (!input?.fuelRecipient) {
      throw new Error('No fuel recipient found');
    }
    const { ethTxNonce, fuelProvider, fuelRecipient } = input;

    // TODO: what happens when has more than 1000 messages ? should we do pagination or something?
    const messages = await fuelProvider.getMessages(fuelRecipient, {
      first: 1000,
    });

    const message = messages.find(
      (message) => message.nonce.toString() === ethTxNonce.toHex(32).toString()
    );

    return message || undefined;
  }

  static async relayMessageOnFuel(
    input: TxEthToFuelInputs['relayMessageOnFuel']
  ) {
    if (!input?.fuelWallet) {
      throw new Error('No fuel wallet found');
    }
    if (!input?.fuelMessage) {
      throw new Error('No fuel message found');
    }
    const { fuelWallet, fuelMessage, txParams } = input;

    const txMessageRelayed = await relayCommonMessage({
      relayer: fuelWallet,
      message: fuelMessage,
      txParams,
    });

    // TODO: put this status check in a separate step after figure out how to get txHash
    const txMessageRelayedResult = await txMessageRelayed.waitForResult();

    if (txMessageRelayedResult.status.type !== 'success') {
      console.log(txMessageRelayedResult.status.reason);
      console.log(txMessageRelayedResult);
      console.log(txMessageRelayedResult.transaction.inputs);
      console.log(txMessageRelayedResult.transaction.outputs);
      throw new Error('failed to relay message from gateway');
    }

    return txMessageRelayed;
  }
}
