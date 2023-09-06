/* eslint-disable no-console */
import type { FuelWalletLocked as FuelWallet } from '@fuel-wallet/sdk';
import type {
  BN,
  Message,
  Address as FuelAddress,
  Provider as FuelProvider,
  TransactionResponse,
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
  ethSender?: string;
  fuelAddress?: FuelAddress;
  fuelProvider?: FuelProvider;
  fuelMessage?: Message;
  ethPublicClient?: PublicClient;
  ethDepositBlockHeight?: string;
  erc20Token?: FetchTokenResult;
  amount?: string;
  fuelRecipient?: FuelAddress;
  blockDate?: Date;
};

type MachineServices = {
  getReceiptsInfo: {
    data: GetReceiptsInfoReturn | undefined;
  };
  getFuelMessage: {
    data: boolean | undefined;
  };
  relayMessageOnFuel: {
    data: TransactionResponse | undefined;
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
                target: 'checkingFuelTx',
              },
            ],
          },
          checkingFuelTx: {
            tags: ['isSettlementDone'],
            initial: 'gettingFuelMessage',
            states: {
              gettingFuelMessage: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                invoke: {
                  src: 'getFuelMessage',
                  data: {
                    input: (ctx: MachineContext) => ({
                      ethTxNonce: ctx.ethTxNonce,
                      fuelRecipient: ctx.fuelRecipient,
                      fuelProvider: ctx.fuelProvider,
                      ethDepositBlockHeight: ctx.ethDepositBlockHeight,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                    },
                    {
                      actions: ['assignFuelMessage'],
                      cond: 'hasFuelMessage',
                      target: 'decidingRelayAction',
                    },
                  ],
                },
                after: {
                  10000: {
                    target: 'gettingFuelMessage',
                  },
                },
              },
              decidingRelayAction: {
                tags: [
                  'isConfirmTransactionLoading',
                  'isConfirmTransactionSelected',
                ],
                always: [
                  {
                    cond: 'hasErc20Token',
                    // TODO: change here to new state that check if relay message already happened
                    target: 'waitingRelayMessage',
                  },
                  {
                    target: 'done',
                  },
                ],
              },
              // TODO: implement here new state check if relay message already happened
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
                tags: ['isConfirmTransactionSelected'],
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
                      // TODO: change here to check if relay message already happened
                      target: 'gettingFuelMessage',
                    },
                    {
                      target: 'done',
                    },
                  ],
                },
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
          ethSender: ev.data?.sender,
          amount: ev.data?.amount,
          fuelRecipient: ev.data?.recipient,
          ethDepositBlockHeight: ev.data?.ethDepositBlockHeight,
          blockDate: ev.data?.blockDate,
        };
      }),
      assignFuelMessage: assign({
        // TODO: fix here when we can get the actual message even if spent
        fuelMessage: (_) => undefined,
        // fuelMessage: (_, ev) => ev.data,
      }),
      setEthToFuelTxDone: (ctx) => {
        if (ctx.ethTxId) {
          EthTxCache.setTxIsDone(ctx.ethTxId);
        }
      },
    },
    guards: {
      hasFuelMessage: (ctx, ev) => !!ctx.fuelMessage || !!ev?.data,
      hasErc20Token: (ctx) => !!ctx.erc20Token,
      hasEthTxNonce: (ctx, ev) => !!ctx.ethTxNonce || !!ev?.data?.nonce,
      hasAnalyzeTxInput: (ctx) =>
        !!ctx.ethTxId &&
        !!ctx.fuelAddress &&
        !!ctx.fuelProvider &&
        !!ctx.ethPublicClient,
      isTxEthToFuelDone: (ctx) => EthTxCache.getTxIsDone(ctx.ethTxId || ''),
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
          // TODO: continue from here. how to get message if it can be spent ?
          return TxEthToFuelService.getFuelMessage(input);
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
