import type { Provider as FuelProvider, MessageProof } from 'fuels';
import type { PublicClient as EthPublicClient } from 'viem';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';

import { FetchMachine } from '~/systems/Core/machines';

type MachineContext = {
  fuelProvider: FuelProvider;
  fuelTxId: string;
  messageId?: string;
  messageProof?: MessageProof;
  ethTxId?: string;
  ethPublicClient?: EthPublicClient;
};

type MachineServices = {
  getMessageId: {
    data: string | undefined;
  };
  getMessageProof: {
    data: MessageProof | undefined | null;
  };
  getMessageRelayed: {
    data: string | undefined;
  };
  relayMessageFromFuelBlock: {
    data: string;
  };
};

type AnalyzeInputs = TxFuelToEthInputs['getMessageProof'] &
  TxFuelToEthInputs['getMessageRelayed'];
export type TxFuelToEthMachineEvents =
  | {
      type: 'START_ANALYZE_TX';
      input: AnalyzeInputs;
    }
  | {
      type: 'RELAY_TO_ETH';
      input: Omit<
        TxFuelToEthInputs['relayMessageFromFuelBlock'],
        'messageProof'
      >;
    };

export const txFuelToEthMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txFuelToEthMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as TxFuelToEthMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_ANALYZE_TX: {
            actions: ['assignAnalyzeTxInput'],
            target: 'submittingToBridge',
          },
        },
      },
      submittingToBridge: {
        initial: 'gettingMessageId',
        states: {
          gettingMessageId: {
            tags: ['isSubmitToBridgeLoading', 'isSubmitToBridgeSelected'],
            invoke: {
              src: 'getMessageId',
              data: {
                input: (ctx: MachineContext) => ({
                  fuelTxId: ctx.fuelTxId,
                  fuelProvider: ctx.fuelProvider,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                  target: 'gettingMessageId',
                },
                {
                  actions: ['assignMessageId'],
                  cond: 'hasMessageId',
                  target: 'checkingSettlement',
                },
              ],
            },
            after: {
              10000: {
                target: 'gettingMessageId',
              },
            },
          },
          checkingSettlement: {
            tags: ['isSubmitToBridgeDone'],
            initial: 'checkingMessageProof',
            states: {
              checkingMessageProof: {
                tags: ['isSettlementLoading', 'isSettlementSelected'],
                invoke: {
                  src: 'getMessageProof',
                  data: {
                    input: (ctx: MachineContext) => ({
                      fuelTxId: ctx.fuelTxId,
                      messageId: ctx.messageId,
                      fuelProvider: ctx.fuelProvider,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                      target: 'checkingMessageProof',
                    },
                    {
                      actions: ['assignMessageProof'],
                      cond: 'hasMessageProof',
                      target: 'checkingRelayed',
                    },
                  ],
                },
                after: {
                  10000: {
                    target: 'checkingMessageProof',
                  },
                },
              },
              checkingRelayed: {
                tags: ['isSettlementDone'],
                initial: 'checkingHasRelayedInEth',
                states: {
                  checkingHasRelayedInEth: {
                    tags: ['isConfirmTransactionSelected'],
                    invoke: {
                      src: 'getMessageRelayed',
                      data: {
                        input: (ctx: MachineContext) => ({
                          messageProof: ctx.messageProof,
                          ethPublicClient: ctx.ethPublicClient,
                        }),
                      },
                      onDone: [
                        {
                          cond: FetchMachine.hasError,
                          target: 'checkingHasRelayedInEth',
                        },
                        {
                          // TODO: fix here after we have event message when relayed in ETH side
                          // actions: ['assignMessageRelayed'],
                          // cond: 'hasMessageRelayed',
                          target: 'waitingEthWalletApproval',
                        },
                        {
                          // TODO: fix here after we have event message when relayed in ETH side
                          // actions: ['assignMessageRelayed'],
                          // cond: 'hasMessageRelayed',
                          target: 'waitingReceive',
                        },
                      ],
                    },
                  },
                  waitingEthWalletApproval: {
                    tags: [
                      'isConfirmTransactionSelected',
                      'isWaitingEthWalletApproval',
                    ],
                    on: {
                      RELAY_TO_ETH: {
                        target: ['relayingMessageFromFuelBlock'],
                      },
                    },
                  },
                  relayingMessageFromFuelBlock: {
                    tags: [
                      'isConfirmTransactionLoading',
                      'isConfirmTransactionSelected',
                    ],
                    invoke: {
                      src: 'relayMessageFromFuelBlock',
                      data: {
                        input: (
                          ctx: MachineContext,
                          ev: Extract<
                            TxFuelToEthMachineEvents,
                            { type: 'RELAY_TO_ETH' }
                          >
                        ) => ({
                          messageProof: ctx.messageProof,
                          ethWalletClient: ev.input.ethWalletClient,
                        }),
                      },
                      onDone: [
                        {
                          cond: FetchMachine.hasError,
                          target: 'waitingEthWalletApproval',
                        },
                        {
                          target: 'checkingHasRelayedInEth',
                        },
                      ],
                    },
                  },
                  waitingReceive: {
                    tags: ['isConfirmTransactionDone'],
                    initial: 'done',
                    states: {
                      // TODO: here should implement state to wait for receipts of relayed txId, to make sure it's settled and put as done
                      done: {
                        tags: ['isReceiveDone'],
                        type: 'final',
                      },
                    },
                  },
                },
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
        fuelTxId: ev.input.fuelTxId,
        fuelProvider: ev.input.fuelProvider,
        ethPublicClient: ev.input.ethPublicClient,
      })),
      assignMessageId: assign({
        messageId: (_, ev) => ev.data || undefined,
      }),
      assignMessageProof: assign({
        messageProof: (_, ev) => ev.data || undefined,
      }),
    },
    guards: {
      hasMessageId: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
      hasMessageProof: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
    },
    services: {
      getMessageId: FetchMachine.create<
        TxFuelToEthInputs['getMessageId'],
        MachineServices['getMessageId']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          return TxFuelToEthService.getMessageId(input);
        },
      }),
      getMessageProof: FetchMachine.create<
        TxFuelToEthInputs['getMessageProof'],
        MachineServices['getMessageProof']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          return TxFuelToEthService.getMessageProof(input);
        },
      }),
      getMessageRelayed: FetchMachine.create<
        TxFuelToEthInputs['getMessageRelayed'],
        MachineServices['getMessageRelayed']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get message relayed');
          }

          return TxFuelToEthService.getMessageRelayed(input);
        },
      }),
      relayMessageFromFuelBlock: FetchMachine.create<
        TxFuelToEthInputs['relayMessageFromFuelBlock'],
        MachineServices['relayMessageFromFuelBlock']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          const resp = await TxFuelToEthService.relayMessageFromFuelBlock(
            input
          );

          return resp;
        },
      }),
    },
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;