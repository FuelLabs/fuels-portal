/* eslint-disable no-console */
import type { FuelWalletLocked as FuelWallet } from '@fuel-wallet/sdk';
import type {
  BN,
  Message as FuelMessage,
  Address as FuelAddress,
  Provider as FuelProvider,
  TransactionResult,
} from 'fuels';
import type { PublicClient } from 'wagmi';
import type { FetchTokenResult } from 'wagmi/actions';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core/machines';

import type { GetReceiptsInfoReturn, TxEthToFuelInputs } from '../services';
import { TxEthToFuelService } from '../services';
import { EthTxCache } from '../utils';

type MachineContext = {
  ethTxId?: `0x${string}`;
  ethTxNonce?: BN;
  fuelAddress?: FuelAddress;
  fuelProvider?: FuelProvider;
  fuelMessage?: FuelMessage;
  ethPublicClient?: PublicClient;
  ethDepositBlockHeight?: string;
  erc20Token?: FetchTokenResult;
  amount?: string;
  fuelRecipient?: FuelAddress;
  blockDate?: Date;
  assetId?: string;
  fuelRelayedTx?: TransactionResult;
};

type MachineServices = {
  getReceiptsInfo: {
    data: GetReceiptsInfoReturn | undefined;
  };
  getFuelMessage: {
    data: FuelMessage | undefined;
  };
  checkSyncDaHeight: {
    data: boolean | undefined;
  };
  checkFuelRelayMessage: {
    data: TransactionResult | undefined;
  };
  relayMessageOnFuel: {
    data: TransactionResult | undefined;
  };
};

type AnalyzeInputs = TxEthToFuelInputs['getReceiptsInfo'] &
  TxEthToFuelInputs['getFuelMessage'];
export type TxEthToFuelMachineEvents =
  | {
      type: 'START_ANALYZE_TX';
      input: Omit<AnalyzeInputs, 'ethTxNonce'>;
    }
  | {
      type: 'RELAY_MESSAGE_ON_FUEL';
      input: {
        fuelWallet: FuelWallet;
      };
    };

export const txEthToFuelMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txEthToFuelMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as TxEthToFuelMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        always: {
          cond: 'hasAnalyzeTxInput',
          target: 'checkingSettlement',
        },
        on: {
          START_ANALYZE_TX: {
            actions: ['assignAnalyzeTxInput'],
            target: 'checkingSettlement',
          },
        },
      },
      checkingSettlement: {
        initial: 'gettingReceiptsInfo',
        states: {
          gettingReceiptsInfo: {
            tags: ['isSettlementLoading', 'isSettlementSelected'],
            invoke: {
              src: 'getReceiptsInfo',
              data: {
                input: (ctx: MachineContext) => ({
                  ethTxId: ctx.ethTxId,
                  ethPublicClient: ctx.ethPublicClient,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignReceiptsInfo'],
                  cond: 'hasEthTxNonce',
                  target: 'checkingDoneCache',
                },
              ],
            },
            after: {
              10000: {
                target: 'gettingReceiptsInfo',
              },
            },
          },
          checkingDoneCache: {
            tags: ['isSettlementLoading', 'isSettlementSelected'],
            always: [
              {
                cond: 'isTxEthToFuelDone',
                target: '#(machine).checkingSettlement.checkingFuelTx.done',
              },
              {
                target: 'decidingCheckMessageAction',
              },
            ],
          },
          decidingCheckMessageAction: {
            // decide if erc20 token get fuel message, otherwise go for daHeight method
            tags: ['isSettlementLoading', 'isSettlementSelected'],
            always: [
              {
                cond: 'hasErc20Token',
                target: 'gettingFuelMessage',
              },
              {
                target: 'checkSyncDaHeight',
              },
            ],
          },
          checkSyncDaHeight: {
            tags: ['isSettlementLoading', 'isSettlementSelected'],
            invoke: {
              src: 'checkSyncDaHeight',
              data: {
                input: (ctx: MachineContext) => ({
                  fuelProvider: ctx.fuelProvider,
                  ethDepositBlockHeight: ctx.ethDepositBlockHeight,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                },
                {
                  cond: 'isDaHeightSynced',
                  target: 'checkingFuelTx',
                },
              ],
            },
            after: {
              10000: {
                target: 'decidingCheckMessageAction',
              },
            },
          },
          gettingFuelMessage: {
            tags: ['isSettlementLoading', 'isSettlementSelected'],
            invoke: {
              src: 'getFuelMessage',
              data: {
                input: (ctx: MachineContext) => ({
                  ethTxNonce: ctx.ethTxNonce,
                  fuelProvider: ctx.fuelProvider,
                  fuelRecipient: ctx.fuelRecipient,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignFuelMessage'],
                  cond: 'hasFuelMessage',
                  target: 'checkingFuelTx',
                },
              ],
            },
            after: {
              10000: {
                target: 'decidingCheckMessageAction',
              },
            },
          },
          checkingFuelTx: {
            tags: ['isSettlementDone'],
            initial: 'decidingRelayAction',
            states: {
              decidingRelayAction: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                always: [
                  {
                    cond: 'hasErc20Token',
                    target: 'checkingFuelRelayMessage',
                  },
                  {
                    target: 'done',
                  },
                ],
              },
              checkingFuelRelayMessage: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                invoke: {
                  src: 'checkFuelRelayMessage',
                  data: {
                    input: (ctx: MachineContext) => ({
                      fuelProvider: ctx.fuelProvider,
                      fuelMessage: ctx.fuelMessage,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                    },
                    {
                      actions: ['assignFuelRelayedTx'],
                      cond: 'hasFuelRelayedTx',
                      target: 'checkingFuelRelayedTx',
                    },
                    {
                      target: 'waitingRelayMessage',
                    },
                  ],
                },
              },
              waitingRelayMessage: {
                tags: [
                  'isConfirmTransactionSelected',
                  'isWaitingFuelWalletApproval',
                ],
                on: {
                  RELAY_MESSAGE_ON_FUEL: {
                    target: 'relayingMessageOnFuel',
                  },
                },
              },
              relayingMessageOnFuel: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                invoke: {
                  src: 'relayMessageOnFuel',
                  data: {
                    input: (
                      ctx: MachineContext,
                      ev: Extract<
                        TxEthToFuelMachineEvents,
                        { type: 'RELAY_MESSAGE_ON_FUEL' }
                      >
                    ) => ({
                      fuelWallet: ev.input.fuelWallet,
                      fuelMessage: ctx.fuelMessage,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                      target: 'checkingFuelRelayMessage',
                    },
                    {
                      actions: ['assignFuelRelayedTx'],
                      target: 'checkingFuelRelayedTx',
                    },
                  ],
                },
              },
              checkingFuelRelayedTx: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                always: [
                  {
                    cond: 'hasFuelRelayedTxSuccess',
                    target: 'done',
                  },
                  {
                    target: 'decidingRelayAction',
                  },
                ],
              },
              done: {
                entry: ['setEthToFuelTxDone'],
                tags: ['isReceiveDone'],
                type: 'final',
              },
            },
          },
        },
      },
      failed: {},
    },
  },
  {
    actions: {
      assignAnalyzeTxInput: assign((_, ev) => ({
        ethTxId: ev.input.ethTxId,
        fuelProvider: ev.input.fuelProvider,
        ethPublicClient: ev.input.ethPublicClient,
      })),
      assignReceiptsInfo: assign((_, ev) => {
        return {
          erc20Token: ev.data?.erc20Token,
          ethTxNonce: ev.data?.nonce,
          amount: ev.data?.amount,
          fuelRecipient: ev.data?.recipient,
          ethDepositBlockHeight: ev.data?.ethDepositBlockHeight,
          blockDate: ev.data?.blockDate,
          assetId: ev.data?.assetId,
        };
      }),
      assignFuelMessage: assign({
        fuelMessage: (_, ev) => ev.data,
      }),
      setEthToFuelTxDone: (ctx) => {
        if (ctx.ethTxId) {
          EthTxCache.setTxIsDone(ctx.ethTxId);
        }
      },
      assignFuelRelayedTx: assign({
        fuelRelayedTx: (_, ev) => ev.data,
      }),
    },
    guards: {
      hasErc20Token: (ctx) => !!ctx.erc20Token,
      isDaHeightSynced: (_, ev) => !!ev?.data,
      hasFuelMessage: (ctx, ev) => !!ctx.fuelMessage || !!ev?.data,
      hasEthTxNonce: (ctx, ev) => !!ctx.ethTxNonce || !!ev?.data?.nonce,
      hasAnalyzeTxInput: (ctx) =>
        !!ctx.ethTxId &&
        !!ctx.fuelAddress &&
        !!ctx.fuelProvider &&
        !!ctx.ethPublicClient,
      isTxEthToFuelDone: (ctx) => EthTxCache.getTxIsDone(ctx.ethTxId || ''),
      hasFuelRelayedTx: (ctx, ev) => !!ctx.fuelRelayedTx || !!ev?.data,
      hasFuelRelayedTxSuccess: (ctx) => {
        if (ctx.fuelRelayedTx?.status !== 'success') {
          console.log(ctx.fuelRelayedTx);
          console.log(ctx.fuelRelayedTx?.status);
          console.log(ctx.fuelRelayedTx?.transaction.inputs);

          return false;
        }

        return true;
      },
    },
    services: {
      getReceiptsInfo: FetchMachine.create<
        TxEthToFuelInputs['getReceiptsInfo'],
        MachineServices['getReceiptsInfo']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to getNonce');
          }

          console.log('getReceiptsInfo');
          return TxEthToFuelService.getReceiptsInfo(input);
        },
      }),
      checkSyncDaHeight: FetchMachine.create<
        TxEthToFuelInputs['checkSyncDaHeight'],
        MachineServices['checkSyncDaHeight']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to checkSyncDaHeight');
          }

          console.log('checkSyncDaHeight');
          return TxEthToFuelService.checkSyncDaHeight(input);
        },
      }),
      getFuelMessage: FetchMachine.create<
        TxEthToFuelInputs['getFuelMessage'],
        MachineServices['getFuelMessage']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          console.log('getFuelMessage');
          return TxEthToFuelService.getFuelMessage(input);
        },
      }),
      checkFuelRelayMessage: FetchMachine.create<
        TxEthToFuelInputs['checkFuelRelayMessage'],
        MachineServices['checkFuelRelayMessage']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to check fuel relay message');
          }

          console.log('checkFuelRelayMessage');
          return TxEthToFuelService.checkFuelRelayMessage(input);
        },
      }),
      relayMessageOnFuel: FetchMachine.create<
        TxEthToFuelInputs['relayMessageOnFuel'],
        MachineServices['relayMessageOnFuel']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to relay message on fuel');
          }

          return TxEthToFuelService.relayMessageOnFuel(input);
        },
      }),
    },
  }
);

export type TxEthToFuelMachine = typeof txEthToFuelMachine;
export type TxEthToFuelMachineService = InterpreterFrom<TxEthToFuelMachine>;
export type TxEthToFuelMachineState = StateFrom<TxEthToFuelMachine>;
