import type { BN } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  test: string;
};

type MachineServices = {
  submitToBridge: {
    data: boolean;
  };
};

export type BridgeEthToFuelMachineEvents = {
  type: 'START_BRIDGING';
  input?: {
    ethAccount: string;
    fuelAccount: string;
    asset: string;
    amount: BN;
  };
};

export const bridgeEthToFuelMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./bridgeEthToFuelMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as BridgeEthToFuelMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_BRIDGING: {
            target: 'bridging',
          },
        },
      },
      bridging: {
        states: {
          submitting: {
            tags: ['loading'],
            invoke: {
              src: 'submitToBridge',
              onDone: [
                {
                  target: 'waitingSettlement',
                },
              ],
            },
          },
          waitingSettlement: {
            after: {
              2000: {
                target: 'waitingConfirmFuelTx',
              },
            },
          },
          waitingConfirmFuelTx: {
            after: {
              2000: {
                target: 'waitingReceiveFunds',
              },
            },
          },
          waitingReceiveFunds: {
            after: {
              2000: {
                target: '#(machine).done',
              },
            },
          },
        },
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    services: {
      submitToBridge: FetchMachine.create<never, boolean>({
        showError: true,
        async fetch() {
          return true;
        },
      }),
    },
  }
);

export type BrigdeEthToFuelMachine = typeof bridgeEthToFuelMachine;
export type BrigdeEthToFuelMachineService =
  InterpreterFrom<BrigdeEthToFuelMachine>;
export type BrigdeEthToFuelMachineState = StateFrom<BrigdeEthToFuelMachine>;
