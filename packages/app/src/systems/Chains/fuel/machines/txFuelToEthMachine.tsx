import type { Provider as FuelProvider } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

type MachineContext = {
  fuelProvider: FuelProvider;
};

type MachineServices = {
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
          START_ANALYZE_TX: {},
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {},
    guards: {},
    services: {},
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;
