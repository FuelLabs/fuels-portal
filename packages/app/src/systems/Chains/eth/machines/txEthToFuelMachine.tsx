import type {
  Provider as EthProvider,
  TransactionResponse as EthTransactionResponse,
} from '@ethersproject/providers';
import type { BN, Message } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxEthToFuelInputs } from '../services';
import { TxEthToFuelService } from '../services';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  ethTx?: EthTransactionResponse;
  ethTxNonce?: BN;
  ethProvider?: EthProvider;
  fuelMessage?: Message;
};

type MachineServices = {
  getDepositNonce: {
    data: BN;
  };
  getFuelMessage: {
    data: Message | undefined;
  };
};

export enum TxEthToFuelStatus {
  waitingSettlement = 'Waiting Settlement',
  waitingReceiveFuel = 'Waiting Receive on Fuel',
  done = 'Done',
}

export type TxEthToFuelMachineEvents = {
  type: 'START_ANALYZE_TX';
  input: { ethTx: EthTransactionResponse; ethProvider: EthProvider };
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
            actions: ['assignEthTx', 'assignEthProvider'],
            target: 'checkingSettlement',
          },
        },
      },
      checkingSettlement: {
        invoke: {
          src: 'getDepositNonce',
          data: {
            input: (ctx: MachineContext) => ({
              ethTx: ctx.ethTx,
              ethProvider: ctx.ethProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'checkingSettlement',
            },
            {
              actions: ['assignEthTxReceipt', 'assignEthTxNonce'],
              cond: 'hasEthTxNonce',
              target: 'checkingFuelTx',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingSettlement',
          },
        },
      },
      checkingFuelTx: {
        invoke: {
          src: 'getFuelMessage',
          data: {
            input: (ctx: MachineContext) => ({
              ethTxNonce: ctx.ethTxNonce,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignFuelMessage'],
              cond: 'hasFuelMessage',
              target: 'done',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingFuelTx',
          },
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {
      assignEthTx: assign({
        ethTx: (_, ev) => ev.input.ethTx,
      }),
      assignEthProvider: assign({
        ethProvider: (_, ev) => ev.input.ethProvider,
      }),
      assignEthTxNonce: assign({
        ethTxNonce: (_, ev) => ev.data,
      }),
      assignFuelMessage: assign({
        fuelMessage: (_, ev) => ev.data,
      }),
    },
    guards: {
      hasFuelMessage: (ctx, ev) => !!ctx.fuelMessage || !!ev?.data,
      hasEthTxNonce: (ctx, ev) => !!ctx.ethTxNonce || !!ev?.data,
    },
    services: {
      getDepositNonce: FetchMachine.create<
        TxEthToFuelInputs['getDepositNonce'],
        MachineServices['getDepositNonce']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to getNonce');
          }

          return TxEthToFuelService.getDepositNonce(input);
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
    },
  }
);

export type TxEthToFuelMachine = typeof txEthToFuelMachine;
export type TxEthToFuelMachineService = InterpreterFrom<TxEthToFuelMachine>;
export type TxEthToFuelMachineState = StateFrom<TxEthToFuelMachine>;
