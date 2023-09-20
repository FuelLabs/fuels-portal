import type {
  BN,
  Provider as FuelProvider,
  Message,
  TransactionRequestLike,
  WalletUnlocked as FuelWallet,
} from 'fuels';
import {
  Address as FuelAddress,
  bn,
  getInputsMessage,
  getTransactionsSummaries,
} from 'fuels';
import type { WalletClient } from 'viem';
import { decodeEventLog } from 'viem';
import type { PublicClient } from 'wagmi';
import type { FetchTokenResult } from 'wagmi/actions';
import { fetchToken } from 'wagmi/actions';
import {
  VITE_ETH_FUEL_ERC20_GATEWAY,
  VITE_ETH_FUEL_MESSAGE_PORTAL,
  VITE_FUEL_FUNGIBLE_TOKEN_ID,
} from '~/config';
import type { BridgeAsset } from '~/systems/Bridge';

import { FUEL_UNITS } from '../../fuel/utils/chain';
import { getBlock } from '../../fuel/utils/getBlock';
import { relayCommonMessage } from '../../fuel/utils/relayMessage';
import type { FuelERC20GatewayArgs } from '../contracts/FuelErc20Gateway';
import { FUEL_ERC_20_GATEWAY } from '../contracts/FuelErc20Gateway';
import type { FuelMessagePortalArgs } from '../contracts/FuelMessagePortal';
import {
  FUEL_MESSAGE_PORTAL,
  decodeMessageSentData,
} from '../contracts/FuelMessagePortal';
import { isErc20Address, getBlockDate } from '../utils';

import { EthConnectorService } from './connectors';

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
    ethTxId?: `0x${string}`;
    ethPublicClient?: PublicClient;
  };
  getFuelMessage: {
    ethTxNonce?: BN;
    fuelRecipient?: FuelAddress;
    fuelProvider?: FuelProvider;
  };
  checkSyncDaHeight: {
    ethDepositBlockHeight?: string;
    fuelProvider?: FuelProvider;
  };
  checkFuelRelayMessage: {
    fuelProvider?: FuelProvider;
    fuelMessage?: Message;
    fuelAddress?: FuelAddress;
  };
  relayMessageOnFuel: {
    fuelWallet?: FuelWallet;
    fuelMessage?: Message;
    txParams?: Pick<
      TransactionRequestLike,
      'gasLimit' | 'gasPrice' | 'maturity'
    >;
  };
  fetchDepositLogs: {
    fuelAddress?: FuelAddress;
    ethPublicClient?: PublicClient;
  };
};

export type GetReceiptsInfoReturn = {
  erc20Token?: FetchTokenResult;
  amount?: string;
  sender?: string;
  recipient?: FuelAddress;
  nonce?: BN;
  ethDepositBlockHeight?: string;
  blockDate?: Date;
  assetId?: string;
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

        // TODO: apply workaround logic to use waitTransactionReceipt together
        const approveTxHashReceipt =
          await ethPublicClient.getTransactionReceipt({ hash: approveTxHash });

        if (approveTxHashReceipt.status !== 'success') {
          throw new Error('Failed to approve Token for transfer');
        }

        const depositTxHash = await fuelErc20Gateway.write.deposit([
          fuelAddress.toB256() as `0x${string}`,
          ethAsset?.address,
          FuelAddress.fromString(VITE_FUEL_FUNGIBLE_TOKEN_ID).toB256(),
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
    if (!input?.ethTxId) {
      throw new Error('No eth Tx id');
    }
    if (!input?.ethPublicClient) {
      throw new Error('No eth Provider');
    }

    const { ethTxId, ethPublicClient } = input;

    let receipt;
    try {
      receipt = await ethPublicClient.getTransactionReceipt({
        hash: ethTxId,
      });
    } catch (err: unknown) {
      // workaround in place because waitForTransactionReceipt stop working after first time using it
      receipt = await ethPublicClient.waitForTransactionReceipt({
        hash: ethTxId,
      });
    }

    if (receipt.status !== 'success') {
      throw new Error('Failed to deposit Token');
    }

    const blockDate = await getBlockDate({
      blockHash: receipt.blockHash,
      publicClient: ethPublicClient,
    });

    let receiptsInfo: GetReceiptsInfoReturn = {
      blockDate,
      ethDepositBlockHeight: receipt.blockNumber.toString(),
    };

    // search for logs of MessageSent event
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < receipt.logs.length; i++) {
      try {
        const messageSentEvent = decodeEventLog({
          abi: FUEL_MESSAGE_PORTAL.abi,
          data: receipt.logs[i].data,
          topics: receipt.logs[i].topics,
        }) as unknown as { args: FuelMessagePortalArgs['MessageSent'] };

        const { amount, sender, nonce, recipient, data } =
          messageSentEvent.args;

        // TODO: get predicate root contract address from FuelMessagePortal contract
        const isErc20Deposit =
          recipient ===
          '0x86a8f7487cb0d3faca1895173d5ff35c1e839bd2ab88657eede9933ea8988815';

        receiptsInfo = {
          ...receiptsInfo,
          nonce: bn(nonce.toString()),
          amount: bn(amount.toString()).format({ precision: FUEL_UNITS }),
          sender,
          recipient: FuelAddress.fromB256(recipient),
          assetId: isErc20Deposit
            ? decodeMessageSentData.erc20Deposit(data).tokenId
            : undefined,
        };
      } catch (_) {
        /* empty */
      }
    }

    // search for logs of Deposit event, for ERC-20 deposit operation
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < receipt.logs.length; i++) {
      try {
        const depositEvent = decodeEventLog({
          abi: FUEL_ERC_20_GATEWAY.abi,
          data: receipt.logs[i].data,
          topics: receipt.logs[i].topics,
        }) as unknown as { args: FuelERC20GatewayArgs['Deposit'] };

        if (isErc20Address(depositEvent.args.tokenId)) {
          const { amount, tokenId } = depositEvent.args;
          const erc20Token = await fetchToken({
            address: tokenId,
          });

          receiptsInfo = {
            ...receiptsInfo,
            amount: bn(amount.toString()).format({
              units: erc20Token.decimals,
              precision: FUEL_UNITS,
            }),
            erc20Token,
          };
        }
      } catch (_) {
        /* empty */
      }
    }

    return receiptsInfo;
  }

  static async checkSyncDaHeight(
    input: TxEthToFuelInputs['checkSyncDaHeight']
  ) {
    if (!input?.fuelProvider) {
      throw new Error('No Fuel provider found');
    }
    if (!input?.ethDepositBlockHeight) {
      throw new Error('No block height found');
    }

    const { fuelProvider, ethDepositBlockHeight } = input;

    const blocks = await fuelProvider.getBlocks({ last: 1 });
    const latestBlockId = blocks?.[0]?.id;
    // TODO: replace this logic when SDK return blocks more complete, with header etc...
    const fuelLatestBlock = await getBlock({
      blockHash: latestBlockId,
      providerUrl: fuelProvider.url,
    });

    // TODO: this method of checking DAheight with ethDepositBlockHeight should be replaced to get actual message instead
    // we'll be able to do this when issue is done: https://github.com/FuelLabs/fuel-core/issues/1323
    // issue to track this work: https://github.com/FuelLabs/fuels-portal/issues/96
    const fuelLatestDAHeight = fuelLatestBlock?.header?.daHeight;

    return bn(fuelLatestDAHeight).gte(ethDepositBlockHeight);
  }

  static async getFuelMessage(input: TxEthToFuelInputs['getFuelMessage']) {
    if (!input?.ethTxNonce) {
      throw new Error('No nonce found');
    }
    if (!input?.fuelProvider) {
      throw new Error('No Fuel provider found');
    }
    if (!input?.fuelRecipient) {
      throw new Error('No Fuel recipient');
    }

    const { ethTxNonce, fuelProvider, fuelRecipient } = input;

    const messages = await fuelProvider.getMessages(fuelRecipient, {
      first: 1000,
    });
    const fuelMessage = messages.find((message) => {
      return message.nonce.toString() === ethTxNonce.toHex(32).toString();
    });

    return fuelMessage;
  }

  static async checkFuelRelayMessage(
    input: TxEthToFuelInputs['checkFuelRelayMessage']
  ) {
    if (!input?.fuelProvider) {
      throw new Error('No fuel provider found');
    }
    if (!input?.fuelMessage) {
      throw new Error('No fuel message found');
    }
    if (!input?.fuelAddress) {
      throw new Error('No fuel address found');
    }
    const { fuelProvider, fuelMessage, fuelAddress } = input;

    const txSummaries = await getTransactionsSummaries({
      filters: {
        first: 1000,
        owner: fuelAddress.toB256(),
      },
      provider: fuelProvider,
    });

    const txMessageRelayed = txSummaries.transactions.find((txSummary) => {
      const messageCoinInputs = getInputsMessage(
        txSummary?.transaction?.inputs || []
      );

      const hasMessageRelayed = messageCoinInputs.find((messageInput) => {
        return (
          messageInput.sender.toString() === fuelMessage.sender.toString() &&
          messageInput.nonce.toString() === fuelMessage.nonce.toString() &&
          messageInput.recipient === fuelMessage.recipient.toString()
        );
      });

      return hasMessageRelayed;
    });

    return txMessageRelayed;
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

    const txMessageRelayedResult = await txMessageRelayed.waitForResult();
    return txMessageRelayedResult;
  }

  static async fetchDepositLogs(input: TxEthToFuelInputs['fetchDepositLogs']) {
    if (!input?.ethPublicClient) {
      throw new Error('Need to connect ETH Wallet');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need fuel address');
    }

    const { ethPublicClient, fuelAddress } = input;

    const abiMessageSent = FUEL_MESSAGE_PORTAL.abi.find(
      ({ name, type }) => name === 'MessageSent' && type === 'event'
    );
    const ethLogs = await ethPublicClient!.getLogs({
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      event: {
        type: 'event',
        name: 'MessageSent',
        inputs: abiMessageSent?.inputs || [],
      },
      args: {
        recipient: fuelAddress?.toHexString() as `0x${string}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      fromBlock: 'earliest',
    });

    const erc20AllLogs = await ethPublicClient!.getLogs({
      address: VITE_ETH_FUEL_MESSAGE_PORTAL as `0x${string}`,
      event: {
        type: 'event',
        name: 'MessageSent',
        inputs: abiMessageSent?.inputs || [],
      },
      args: {
        recipient:
          // TODO: get predicate root contract address from FuelMessagePortal contract
          '0x86a8f7487cb0d3faca1895173d5ff35c1e839bd2ab88657eede9933ea8988815',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      fromBlock: 'earliest',
    });

    const erc20Logs = erc20AllLogs.filter((log) => {
      const messageSentEvent = decodeEventLog({
        abi: FUEL_MESSAGE_PORTAL.abi,
        data: log.data,
        topics: log.topics,
      }) as unknown as { args: FuelMessagePortalArgs['MessageSent'] };

      const { to } = decodeMessageSentData.erc20Deposit(
        messageSentEvent.args.data
      );

      return to === fuelAddress?.toHexString();
    });

    return [...ethLogs, ...erc20Logs];
  }
}
