/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Provider as FuelProvider,
  MessageProof,
  TransactionResult,
} from 'fuels';
import type { PublicClient as EthPublicClient } from 'viem';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { RelayMessageParams } from '../../eth/utils/relayMessage';
import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';

import { FetchMachine } from '~/systems/Core/machines';

type MachineContext = {
  fuelProvider: FuelProvider;
  fuelTxId: string;
  fuelTxResult?: TransactionResult<any, void>;
  fuelLastBlockId?: string;
  messageId?: string;
  messageProof?: MessageProof;
  relayMessageParams?: RelayMessageParams;
  ethTxId?: string;
  ethPublicClient?: EthPublicClient;
};

type MachineServices = {
  waitFuelTxResult: {
    data: TransactionResult<any, void>;
  };
  waitNextBlock: {
    data: string | undefined;
  };
  getMessageId: {
    data: string | undefined;
  };
  getMessageProof: {
    data:
      | {
          withdrawMessageProof: MessageProof | undefined;
          relayMessageParams: RelayMessageParams | undefined;
        }
      | undefined;
  };
  waitBlockCommit: {
    data: boolean | undefined;
  };
  waitBlockFinalization: {
    data: boolean | undefined;
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
        initial: 'waitingFuelTxResult',
        states: {
          waitingFuelTxResult: {
            tags: ['isSubmitToBridgeLoading', 'isSubmitToBridgeSelected'],
            invoke: {
              src: 'waitFuelTxResult',
              data: {
                input: (ctx: MachineContext) => ({
                  fuelTxId: ctx.fuelTxId,
                  fuelProvider: ctx.fuelProvider,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                  target: 'waitingFuelTxResult',
                },
                {
                  actions: ['assignFuelTxResult'],
                  cond: 'hasFuelTxResult',
                  target: 'gettingFuelMessageId',
                },
              ],
            },
          },
          gettingFuelMessageId: {
            tags: ['isSubmitToBridgeLoading', 'isSubmitToBridgeSelected'],
            invoke: {
              src: 'getMessageId',
              data: {
                input: (ctx: MachineContext) => ({
                  receipts: ctx.fuelTxResult?.receipts,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignMessageId'],
                  cond: 'hasMessageId',
                  target: 'waitingNextBlock',
                },
              ],
            },
            after: {
              10000: {
                target: 'waitingFuelTxResult',
              },
            },
          },
          waitingNextBlock: {
            tags: ['isSubmitToBridgeLoading', 'isSubmitToBridgeSelected'],
            invoke: {
              src: 'waitNextBlock',
              data: {
                input: (ctx: MachineContext) => ({
                  fuelProvider: ctx.fuelProvider,
                  blockId: ctx.fuelTxResult?.blockId,
                }),
              },
              onDone: [
                {
                  cond: FetchMachine.hasError,
                },
                {
                  actions: ['assignFuelLastBlockId'],
                  cond: 'hasFuelLastBlockId',
                  target: 'checkingSettlement',
                },
              ],
            },
            after: {
              5000: {
                target: 'waitingNextBlock',
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
                      fuelLastBlockId: ctx.fuelLastBlockId,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                    },
                    {
                      actions: [
                        'assignMessageProof',
                        'assignRelayMessageParams',
                      ],
                      cond: 'hasRelayMessageParams',
                      target: 'waitingBlockCommit',
                    },
                  ],
                },
                after: {
                  10000: {
                    target: 'checkingMessageProof',
                  },
                },
              },
              waitingBlockCommit: {
                tags: ['isSettlementLoading', 'isSettlementSelected'],
                invoke: {
                  src: 'waitBlockCommit',
                  data: {
                    input: (ctx: MachineContext) => ({
                      rootBlockHeader: ctx.relayMessageParams?.rootBlockHeader,
                      ethPublicClient: ctx.ethPublicClient,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                    },
                    {
                      cond: 'hasBlockCommited',
                      target: 'waitingBlockFinalization',
                    },
                  ],
                },
                after: {
                  10000: {
                    target: 'waitingBlockCommit',
                  },
                },
              },
              waitingBlockFinalization: {
                tags: ['isSettlementLoading', 'isSettlementSelected'],
                invoke: {
                  src: 'waitBlockFinalization',
                  data: {
                    input: (ctx: MachineContext) => ({
                      rootBlockHeader: ctx.relayMessageParams?.rootBlockHeader,
                      ethPublicClient: ctx.ethPublicClient,
                    }),
                  },
                  onDone: [
                    {
                      cond: FetchMachine.hasError,
                    },
                    {
                      cond: 'hasBlockFinalized',
                      target: 'checkingRelayed',
                    },
                  ],
                },
                after: {
                  10000: {
                    target: 'waitingBlockFinalization',
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
                          relayMessageParams: ctx.relayMessageParams,
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
      assignFuelTxResult: assign({
        fuelTxResult: (_, ev) => ev.data || undefined,
      }),
      assignMessageId: assign({
        messageId: (_, ev) => ev.data || undefined,
      }),
      assignMessageProof: assign({
        messageProof: (_, ev) => ev.data?.withdrawMessageProof || undefined,
      }),
      assignRelayMessageParams: assign({
        relayMessageParams: (_, ev) => ev.data?.relayMessageParams || undefined,
      }),
      assignFuelLastBlockId: assign({
        fuelLastBlockId: (_, ev) => ev.data || undefined,
      }),
    },
    guards: {
      hasFuelTxResult: (ctx, ev) => !!ctx.fuelTxResult || !!ev?.data,
      hasMessageId: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
      hasRelayMessageParams: (ctx, ev) =>
        !!ctx.relayMessageParams || !!ev?.data?.relayMessageParams,
      hasFuelLastBlockId: (ctx, ev) => !!ctx.fuelLastBlockId || !!ev?.data,
      hasBlockCommited: (_, ev) => !!ev?.data,
      hasBlockFinalized: (_, ev) => !!ev?.data,
    },
    services: {
      waitFuelTxResult: FetchMachine.create<
        TxFuelToEthInputs['waitTxResult'],
        MachineServices['waitFuelTxResult']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to wait tx result');
          }

          const result = await TxFuelToEthService.waitTxResult(input);

          return result;
        },
      }),
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
      waitNextBlock: FetchMachine.create<
        TxFuelToEthInputs['waitNextBlock'],
        MachineServices['waitNextBlock']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to wait next block');
          }

          return TxFuelToEthService.waitNextBlock(input);
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
      waitBlockCommit: FetchMachine.create<
        TxFuelToEthInputs['waitBlockCommit'],
        MachineServices['waitBlockCommit']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to wait block commit');
          }

          return TxFuelToEthService.waitBlockCommit(input);
        },
      }),
      waitBlockFinalization: FetchMachine.create<
        TxFuelToEthInputs['waitBlockFinalization'],
        MachineServices['waitBlockFinalization']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to wait block commit');
          }

          return TxFuelToEthService.waitBlockFinalization(input);
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
