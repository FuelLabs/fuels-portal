import type { Fuel } from '@fuel-wallet/sdk';
import type { InterpreterFrom } from 'xstate';
import { createMachine, assign } from 'xstate';

export type AccountMachineContext = {
  fuel: Fuel;
  fuelAccounts?: string[];
};

export type AccountMachineEvents =
  | {
      type: 'INITIALIZE_FUEL';
      data: { fuel: Fuel };
    }
  | { type: 'FETCH_ACCOUNT' };

type AccountMachineServices = {
  fetchAccounts: {
    data: string[];
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
    initial: 'idle',
    states: {
      idle: {
        on: {
          INITIALIZE_FUEL: {
            actions: ['initializeAccounts'],
            target: 'fetchingAccounts',
          },
        },
      },
      fetchingAccounts: {
        tags: ['loading'],
        invoke: {
          src: 'fetchAccounts',
          onDone: [
            {
              actions: 'setAccounts',
              target: 'idle',
            },
          ],
          onError: [
            {
              actions: '',
            },
          ],
        },
      },
    },
  },
  {
    services: {
      fetchAccounts: async (ctx) => {
        const accounts = await ctx.fuel.accounts();
        return accounts;
      },
    },
    actions: {
      initializeAccounts: assign((ctx, ev) => ({
        ...ctx,
        fuel: ev.data.fuel,
      })),
      setAccounts: assign((_, ev) => {
        return {
          fuelAccounts: ev.data,
        };
      }),
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<AccountMachine>;
