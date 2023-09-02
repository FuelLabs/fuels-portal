import type { Address as FuelAddress, Provider as FuelProvider } from 'fuels';
import type { PublicClient } from 'wagmi';
import type { ActorRefFrom, InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine, spawn } from 'xstate';
import type { TxFuelToEthMachineEvents } from '~/systems/Chains';
import { isEthChain, isFuelChain, txFuelToEthMachine } from '~/systems/Chains';
import type { TxEthToFuelMachineEvents } from '~/systems/Chains/eth/machines';
import { txEthToFuelMachine } from '~/systems/Chains/eth/machines';
import { FetchMachine } from '~/systems/Core';

import { BridgeService, type BridgeInputs } from '../services';
import type { BridgeTx } from '../types';

export type BridgeTxsMachineContext = {
  ethToFuelTxRefs: {
    [key: string]: ActorRefFrom<typeof txEthToFuelMachine>;
  };
  fuelToEthTxRefs: {
    [key: string]: ActorRefFrom<typeof txFuelToEthMachine>;
  };
  bridgeTxs?: BridgeTx[];
  fuelProvider?: FuelProvider;
  ethPublicClient?: PublicClient;
  fuelAddress?: FuelAddress;
};

type MachineServices = {
  fetchTxs: {
    data: BridgeTx[];
  };
};

export type BridgeTxsMachineEvents =
  | {
      type: 'FETCH';
      input: BridgeInputs['fetchTxs'];
    }
  | TxEthToFuelMachineEvents
  | TxFuelToEthMachineEvents;

export const bridgeTxsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./bridgeTxsMachine.typegen').Typegen0,
    schema: {
      context: {} as BridgeTxsMachineContext,
      services: {} as MachineServices,
      events: {} as BridgeTxsMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH: {
            actions: ['assignFetchInputs'],
            target: 'fetching',
          },
        },
      },
      fetching: {
        tags: ['isLoading'],
        invoke: {
          src: 'fetchTxs',
          data: {
            input: (ctx: BridgeTxsMachineContext) => ({
              ethPublicClient: ctx.ethPublicClient,
              fuelProvider: ctx.fuelProvider,
              fuelAddress: ctx.fuelAddress,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
            },
            {
              actions: ['assignEthToFuelTxRefs', 'assignBridgeTxs'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignFetchInputs: assign((ctx, ev) => ({
        fuelProvider: ev.input?.fuelProvider || ctx.fuelProvider,
        ethPublicClient: ev.input?.ethPublicClient || ctx.ethPublicClient,
        fuelAddress: ev.input?.fuelAddress || ctx.fuelAddress,
      })),
      assignEthToFuelTxRefs: assign({
        ethToFuelTxRefs: (ctx, ev) => {
          const ethToFuelBridgeTxs = ev.data.filter(({ fromNetwork }) =>
            isEthChain(fromNetwork)
          );

          const newRefs = ethToFuelBridgeTxs.reduce((prev, tx) => {
            // safely avoid overriding instance
            if (ctx.ethToFuelTxRefs?.[tx.txHash]) return prev;

            return {
              ...prev,
              [tx.txHash]: spawn(
                txEthToFuelMachine.withContext({
                  ethTxId: tx.txHash as `0x${string}`,
                  fuelAddress: ctx.fuelAddress,
                  fuelProvider: ctx.fuelProvider,
                  ethPublicClient: ctx.ethPublicClient,
                }),
                { name: tx.txHash }
              ),
            };
          }, {});

          return {
            ...(ctx.ethToFuelTxRefs || {}),
            ...newRefs,
          };
        },
        fuelToEthTxRefs: (ctx, ev) => {
          const fuelToEthBridgeTxs = ev.data.filter(({ fromNetwork }) =>
            isFuelChain(fromNetwork)
          );

          const newRefs = fuelToEthBridgeTxs.reduce((prev, tx) => {
            // safely avoid overriding instance
            if (ctx.fuelToEthTxRefs?.[tx.txHash]) return prev;

            return {
              ...prev,
              [tx.txHash]: spawn(
                txFuelToEthMachine.withContext({
                  fuelTxId: tx.txHash,
                  fuelProvider: ctx.fuelProvider,
                  ethPublicClient: ctx.ethPublicClient,
                }),
                { name: tx.txHash }
              ),
            };
          }, {});

          return {
            ...(ctx.fuelToEthTxRefs || {}),
            ...newRefs,
          };
        },
      }),
      assignBridgeTxs: assign((_, ev) => ({
        bridgeTxs: ev.data,
      })),
    },
    services: {
      fetchTxs: FetchMachine.create<
        BridgeInputs['fetchTxs'],
        MachineServices['fetchTxs']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to bridge');
          }

          const txs = await BridgeService.fetchTxs(input);

          return txs;
        },
      }),
    },
  }
);

export type BridgeTxsMachine = typeof bridgeTxsMachine;
export type BridgeTxsMachineService = InterpreterFrom<BridgeTxsMachine>;
export type BridgeTxsMachineState = StateFrom<BridgeTxsMachine>;
