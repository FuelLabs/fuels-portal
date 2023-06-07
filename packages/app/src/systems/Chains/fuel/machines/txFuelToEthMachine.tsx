import type { BN, Provider as FuelProvider, TransactionResponse } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  fuelProvider?: FuelProvider;
  fuelTx?: TransactionResponse;
  fuelTxNonce?: BN;
};

type MachineServices = {
  getDepositNonce: {
    data: BN;
  };
  getFuelTransaction: {
    data: any | undefined;
  };
};

export enum TxFuelToEthStatus {
  waitingFuelTransaction = 'Waiting Fuel Transaction',
  waitingSettlement = 'Waiting Settlement',
  waitingReceiveFuel = 'Waiting Receive on Fuel',
  done = 'Done',
}

export type TxFuelToEthMachineEvents = {
  type: 'START_ANALYZE_TX';
  input: any;
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
            target: 'checkingSettlement',
          },
        },
      },
      checkingSettlement: {
        invoke: {
          src: 'getDepositNonce',
          data: {
            input: (ctx: MachineContext) => ({
              fuelTx: ctx.fuelTx,
              fuelProvider: ctx.fuelProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'checkingSettlement',
            },
            {
              actions: ['assignFuelTxNonce'],
              cond: 'hasFuelTxNonce',
              target: 'checkingEthTx',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingSettlement',
          },
        },
      },
      checkingEthTx: {},
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {
      assignAnalyzeTxInput: assign((_, ev) => ({
        fuelProvider: ev.input.fuelProvider,
      })),
      assignFuelTxNonce: assign({
        fuelTxNonce: (_, ev) => ev.data,
      }),
    },
    guards: {
      hasFuelTxNonce: (ctx, ev) => !!ctx.fuelTxNonce || !!ev?.data,
    },
    services: {
      getDepositNonce: FetchMachine.create<
        TxFuelToEthInputs['getDepositNonce'],
        MachineServices['getDepositNonce']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to getNonce');
          }

          return TxFuelToEthService.getDepositNonce(input);
        },
      }),
    },
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;
