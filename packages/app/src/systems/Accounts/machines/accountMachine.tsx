import type { Fuel } from '@fuel-wallet/sdk';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

export type AccountMachineContext = {
  fuel?: Fuel;
  currentAccount?: string;
};

type AccountMachineEvents =
  | { type: 'WALLET_DETECTED'; value: Fuel }
  | { type: 'CONNECT' };

type AccountMachineServices = {
  fetchAccount: {
    data: string;
  };
};

export const accountMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./accountMachine.typegen').Typegen0,
    schema: {
      context: {} as AccountMachineContext,
      events: {} as AccountMachineEvents,
      services: {} as AccountMachineServices,
    },
    predictableActionArguments: true,
    id: 'accountMachine',
    initial: 'fetchingFuel',
    states: {
      fetchingFuel: {
        always: [
          {
            cond: (ctx) => !!ctx.fuel,
            target: 'connectingWallet',
          },
        ],
        on: {
          WALLET_DETECTED: {
            actions: ['assignFuel'],
            target: 'connectingWallet',
          },
        },
      },
      connectingWallet: {
        initial: 'fetchingConnection',
        states: {
          idle: {
            on: {
              CONNECT: {
                target: 'connecting',
              },
            },
          },
          fetchingConnection: {
            tags: ['isLoading'],
            invoke: {
              src: (ctx) => ctx.fuel!.isConnected(),
              onDone: [{ target: 'idle' }],
            },
          },
          connecting: {
            tags: ['isLoading'],
            invoke: {
              src: (ctx) => ctx.fuel!.connect(),
              onDone: [
                {
                  target: 'fetchingAccount',
                },
              ],
            },
          },
          fetchingAccount: {
            tags: ['isLoading'],
            invoke: {
              src: 'fetchAccount',
              onDone: [
                {
                  actions: ['assignAccount'],
                  target: 'idle',
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignAccount: assign({
        currentAccount: (_, ev) => ev.data,
      }),
    },
    services: {
      fetchAccount: (ctx) => ctx.fuel!.currentAccount(),
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<AccountMachine>;
export type AccountMachineState = StateFrom<AccountMachine>;
