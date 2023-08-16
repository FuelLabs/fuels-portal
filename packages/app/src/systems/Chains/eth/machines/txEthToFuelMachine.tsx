import type { TransactionResponse as EthTransactionResponse } from '@ethersproject/providers';
import type {
  BN,
  Message,
  Address as FuelAddress,
  Provider as FuelProvider,
  WalletUnlocked as FuelWallet,
  TransactionResponse,
} from 'fuels';
import type { PublicClient } from 'wagmi';
import type { FetchTokenResult } from 'wagmi/actions';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { GetReceiptsInfoReturn, TxEthToFuelInputs } from '../services';
import { TxEthToFuelService } from '../services';

import { FetchMachine } from '~/systems/Core/machines';

type MachineContext = {
  ethPublicClient?: PublicClient;
  ethTx?: EthTransactionResponse;
  ethTxNonce?: BN;
  ethSender?: string;
  fuelProvider?: FuelProvider;
  fuelMessage?: Message;
  erc20Token: FetchTokenResult;
  amount?: string;
  fuelRecipient?: FuelAddress;
};

type MachineServices = {
  getReceiptsInfo: {
    data: GetReceiptsInfoReturn | undefined;
  };
  getFuelMessage: {
    data: Message | undefined;
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
                  ethTx: ctx.ethTx,
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
                  target: 'checkingFuelTx',
                },
              ],
            },
            after: {
              10000: {
                target: 'gettingReceiptsInfo',
              },
            },
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
        ethTx: ev.input.ethTx,
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
        };
      }),
      assignFuelMessage: assign({
        fuelMessage: (_, ev) => ev.data,
      }),
      setEthToFuelTxDone: (ctx) => {
        if (ctx.ethTx?.hash) {
          // EthTxCache.setTxIsDone(ctx.ethTx.hash);
        }
      },
    },
    guards: {
      hasFuelMessage: (ctx, ev) => !!ctx.fuelMessage || !!ev?.data,
      hasEthTxNonce: (ctx, ev) => !!ctx.ethTxNonce || !!ev?.data,
      hasErc20Token: (ctx) => !!ctx.erc20Token,
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
