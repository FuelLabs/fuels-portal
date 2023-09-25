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
    // TODO: work on the visualization of xstate to show in next demo / put in the docs of bridge
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAZQBUBBAJXoH1GA5RgGQE0AWgFE29ABoBtAAwBdRKAAOAe1i4ALriX55IAB6IAjACYArCRNTLBqQA5TAdhMBmAGwBOADQgAnontubEiN3F1CXIzdHFxsAXxivNCw8QlJyKmppOSQQZVUNLR19BGMzCytbB2d3L18ERyMgkJcAFikTeycnKRc4hIwcAmISHDBMAGsCKFowNTUqVDB8NRIYWcnmUbBcBTVYAEl8ADMlaggtMDJ8ADclMYvEgZTh7FGJ-CmZubAFpZXP9c2212B2OCAIN0w6Hy+EymR0uXUmm02SKJmagXszSMBhsUnsNmaLic9iMNUMAXMRksRns9SkzXaTl6IAeySGI3Gk2ms3mi2Wqw07w2mC2O32RxOZ0IlxudxIrMGpA5bw+PO+fL+ayFgLFIKUYOuSkh0NhBiyihUiIKKMQLnaQRxmOCzhsbgMJjJCFMDXRUjczXdRkJTn9TPiLP6bKVL05725Xx+-P+2pFQPFx2oulgaihF3QhzUYAATshrJYpERqAqnsquZ9eb8BQDU7qJXDsgjoYVbV0SAZ7DiTOEpJ08c1Pe6DCQpFSZwH3KPms1mdX2TGVfGG8ta+8ACLnADCSRo7YteSR3YQJhs9nMNhMbrR96MrnsnpM9pMBjckSH0SDrorpGirPK8dZqomoGxlA+6EEeIwZGa8KWl2NpXjed4Pu66ImC+Lhvj4iD3reBjuK6IZVO0y7hqu0ZgXG9bqr8ECjOQkwHuuACycCwOgMCMJg0IZLIyHntaoBFNYRiBHa4Q0sE9I0uOhEIG4fqNAEP6dCGBjGEBSQgTuqoJhqLGYGx7wca83GwLx-GCUiiHmjkKEXmh1hODJQ5GPJLiKZinqOFOwQ-l+Aa0rYBj6Y8a70cZW5QWMtDePgmC7ugAASWxQNgainOcMq3PcwE1uu4Emb8yrJal6VZbgOVqAaEJQkisIiR2rniXoiBOFUJDhM0AS2HODLKbU+EuNO36RO4aKEkY0VRol5UJVVKVpZl2W5fl0rgkV8olbF0Gbkx27rtVG11Q1TVGi1Wims5nZuRJPVqSQNjGINRIWJETgTgEt4dBU7hSAYTj9tRfQGaVcUnZBa01Zt9XbVmOaFiQ+aFiWZaWJWtHLQxEEagjl1bWop4uWJyIvcUM5eXJJJ+ViAUqfYI4kPY7j+viTiDW40mLYZZWExVSZalAABiACuYAUDZdk0FKFx7XK+NGXDGpNu80uy-LfFgDdxqtbIFNPV1RS9UuJDEnzI74u6BG1DYvNTT+AFs6EJiCzDx2MZBWuSzLcs8frO3K4aquHXRvtE42yaB7rIcwIbd0wibSEdVTl6eVI72fW431+h0npUr1QRdM79IEiOwTe0dG5+5r8c68Htmh6juYYwWxaluWFZVlHBPxadmqCgnrcK6bnXU91tOef13m+f5Y1ES4U6c5p7Rft+D519HDex2dcUt-QugkGZFlQBsFDoN4AlCVPWfucYTj9UGANosEzsGBOdrBWRH1rwEgDHvIeGtKrC3Hqfc+rEIAAhvnfByWgnKiStDPSSL836DRvJ-aI4N-rGHMN+GwroSEEhJKA9WjcIHHyDtAoyLdr63z1jAMOhVI7Q3ritEeDC6Fn14bLJh3gWEGz2kbe6Jt2pnjQZeAwzQ2bW2aMSLoaJrx+hXsURkRCAY+XttiShkDwFH2giffhkDGGy2YUnRWBUVbFU4fvbh8NzF8KHhYhBIiU4mnTo9aesiPq5wiNEJcS5rzohsL-AMHMK4vhfO0AWNFB5UMPm41xAiKBCJEWwuxB0HFgOocYlUpjUmCMscI6xXjjYyAkEYXxT8aY4msEEAuwDQkEhIROToZhQYBGiLNVou9El5OSaLEpFBoEAHd0CIm1B46x1BmBCB4IwPgbBOJCFoLQRgABxEQAB5TgbAJYAFUlmPxke5H8k17yBj8n+IkE5pLNG0TeHEI4SF4gMbDApYzoFFjKZMERez8At2yRHexMVHEi1Wi42WfyAXvCBSCoOlSJHVKkZTC5DTMEDQ-liPBP8VKkXZhvG8uI2gkmvF8mOoz0nwoQYC6xwLQVK3YRCpaIyYW0LhWff5DLEVMuRbLVFadqkZ2kahbFL4sF4q-vgolSjgoVw8qDUwQ5qUH1pbC8ZZjuUZLKZAU+wk6lYtngBSaeI6ZyNsDeB5RLQivx6SQkMwQc5hihpC-JKS6W6pMUHIRhrdAoMzqaooVJIgc1dHbWkA43AeiJf4Z5TqSF+R8oM8M+AlAsXgNkWiqDJWzwALQuE9IW6VkQfy9LRJFUikMIx5LSGAfNz1Z5YkCkOEgbhXBOCDJ0Qklh3X1s9Zy06zbzY9R7Xnd+hdfqeiJJSKwNJ2gDW+hqpxTdxbClFMCCUY70GIFaLnXqXaOhuhvKejRpgpwzgHWDXmnMPJruhTwyBsEwDwReHu7O94p1fV6kXP6KkCRuGnDXB8wTMSASGcOwxPyL5wMslxax98W1m33XUXCHMWmEm-FSHyhKnYfhIAGAIztGYMlwk+4ezjXgXVqmTL97kfKBADK0JcQZ8J2A0SSQIX4fy4mcAOWkg61awZSQHFuIjGMNKDLePyXb8LWFdGEz0KbtH8wJM4HOdbRPfO9dq0+0nZ64gaHIgkNJbCOA-BEol35bw9OiLpF0OIqNGN+WfeD8Db4oa6mhy8alAgkOkvSXm-oIgEcMK6EDrp0SnvpIvVzPyfVjMydYozkk+bvTUg+f0oMCTfl-sEV2OCbB+WduERL+m9WTOmWPVLbcYDpcQD5cInbK3BOdkNDRYNpLEdcEOOwLRfyVa1dV3lCKoBIpbk1hA95c5meZpZj814Jwfkmi0Qa2I0QhFpCNrlfqeUpYNRAQzIaC1huCA0St2HOu4m66Ef+ANXA-n7LEaDHKxOjYOzq8+5wZtKQtS+Vo34KMjgnGp5N8i2b8z0u9kChxplUAgDNttKkyJ9aJKDLotIuZxDiEAA */
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
                      fuelAddress: ctx.fuelAddress,
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
