import type {
  BN,
  Provider as FuelProvider,
  TransactionResponse as FuelTransactionResponse,
} from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  fuelProvider?: FuelProvider;
  fuelTx?: FuelTransactionResponse;
  fuelTxHash?: string;
};

type MachineServices = {
  getWithdrawHash: {
    data: string;
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
          src: 'getWithdrawHash',
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
              actions: ['assignFuelTxHash'],
              cond: 'hasFuelTxHash',
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
      checkingEthTx: {
        invoke: {
          src: 'getEthMessage',
          data: {
            input: (ctx: MachineContext) => ({
              fuelTxHash: ctx.fuelTxHash,
              fuelProvider: ctx.fuelProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignEthTx'],
              cond: 'hasEthTx',
              target: 'done',
            },
          ],
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
      assignAnalyzeTxInput: assign((_, ev) => ({
        fuelProvider: ev.input.fuelProvider,
      })),
      assignFuelTxHash: assign({
        fuelTxHash: (_, ev) => ev.data,
      }),
      assignEthTx: assign({
        ethTx: (_, ev) => ev.data,
      }),
    },
    guards: {
      hasFuelTxHash: (ctx, ev) => !!ctx.fuelTxHash || !!ev?.data,
    },
    services: {
      getWithdrawHash: FetchMachine.create<
        TxFuelToEthInputs['getWithdrawHash'],
        MachineServices['getWithdrawHash']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to getNonce');
          }

          return TxFuelToEthService.getWithdrawHash(input);
        },
      }),
    },
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;
