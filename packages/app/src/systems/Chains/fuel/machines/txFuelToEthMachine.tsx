/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Provider as FuelProvider,
  MessageProof,
  TransactionResult,
} from 'fuels';
import type { PublicClient as EthPublicClient } from 'wagmi';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { RelayMessageParams } from '../../eth/utils/relayMessage';
import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';
import { FuelTxCache } from '../utils';

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
  txHashMessageRelayed?: string;
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
  waitTxMessageRelayed: {
    data: boolean | undefined;
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
                },
                {
                  actions: ['assignFuelTxResult'],
                  cond: 'hasFuelTxResult',
                  target: 'gettingFuelMessageId',
                },
              ],
            },
            after: {
              10000: {
                target: 'waitingFuelTxResult',
              },
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
                          messageId: ctx.messageId,
                        }),
                      },
                      onDone: [
                        {
                          cond: FetchMachine.hasError,
                        },
                        {
                          actions: ['assignTxHashMessageRelayed'],
                          cond: 'hasTxHashMessageRelayed',
                          target: 'waitingReceive',
                        },
                        {
                          target: 'waitingEthWalletApproval',
                        },
                      ],
                    },
                    after: {
                      10000: {
                        target: 'checkingHasRelayedInEth',
                      },
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
                        },
                        {
                          target: 'checkingHasRelayedInEth',
                        },
                      ],
                    },
                    after: {
                      10000: {
                        target: 'relayingMessageFromFuelBlock',
                      },
                    },
                  },
                  waitingReceive: {
                    tags: ['isConfirmTransactionDone'],
                    initial: 'waitTxMessageRelayed',
                    states: {
                      waitTxMessageRelayed: {
                        tags: ['isReceiveLoading', 'isReceiveSelected'],
                        invoke: {
                          src: 'waitTxMessageRelayed',
                          data: {
                            input: (ctx: MachineContext) => ({
                              txHash: ctx.txHashMessageRelayed,
                              ethPublicClient: ctx.ethPublicClient,
                            }),
                          },
                          onDone: [
                            {
                              cond: FetchMachine.hasError,
                            },
                            {
                              cond: 'hasTxMessageRelayed',
                              target: 'done',
                            },
                          ],
                        },
                        after: {
                          10000: {
                            target: 'waitTxMessageRelayed',
                          },
                        },
                      },
                      done: {
                        entry: ['setFuelToEthTxDone'],
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
      assignTxHashMessageRelayed: assign({
        txHashMessageRelayed: (_, ev) => ev.data || undefined,
      }),
      setFuelToEthTxDone: (ctx) => {
        if (ctx.fuelTxId) {
          FuelTxCache.setTxIsDone(ctx.fuelTxId);
        }
      },
    },
    guards: {
      hasFuelTxResult: (ctx, ev) => !!ctx.fuelTxResult || !!ev?.data,
      hasMessageId: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
      hasRelayMessageParams: (ctx, ev) =>
        !!ctx.relayMessageParams || !!ev?.data?.relayMessageParams,
      hasFuelLastBlockId: (ctx, ev) => !!ctx.fuelLastBlockId || !!ev?.data,
      hasBlockCommited: (_, ev) => !!ev?.data,
      hasBlockFinalized: (_, ev) => !!ev?.data,
      hasTxHashMessageRelayed: (ctx, ev) =>
        !!ctx.txHashMessageRelayed || !!ev?.data,
      hasTxMessageRelayed: (_, ev) => !!ev?.data,
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

          console.log('waitFuelTxResult');

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
          console.log('getMessageId');

          const result = await TxFuelToEthService.getMessageId(input);

          return result;
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
          console.log('waitNextBlock');

          const result = await TxFuelToEthService.waitNextBlock(input);

          return result;
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

          console.log('getMessageProof');
          const result = await TxFuelToEthService.getMessageProof(input);
          return result;
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

          console.log('waitBlockCommit');
          const result = await TxFuelToEthService.waitBlockCommit(input);
          return result;
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

          console.log('waitBlockFinalization');
          const result = TxFuelToEthService.waitBlockFinalization(input);
          return result;
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

          console.log('getMessageRelayed');
          const txHashMessageRelayed =
            await TxFuelToEthService.getMessageRelayed(input);
          return txHashMessageRelayed;
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

          console.log('relayMessageFromFuelBlock');
          const resp = await TxFuelToEthService.relayMessageFromFuelBlock(
            input
          );

          return resp;
        },
      }),
      waitTxMessageRelayed: FetchMachine.create<
        TxFuelToEthInputs['waitTxMessageRelayed'],
        MachineServices['waitTxMessageRelayed']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to wait tx message relayed');
          }

          console.log('waitTxMessageRelayed');
          const resp = await TxFuelToEthService.waitTxMessageRelayed(input);

          return resp;
        },
      }),
    },
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;
