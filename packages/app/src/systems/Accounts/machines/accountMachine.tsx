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
  fetchIsConnected: {
    data: boolean;
  };
};

export const accountMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMDGqD2BXAdgFwFk0ALASxzADoAzMPVMnKAMSzABsBiAdQEEAZfgFEAKgH0AIqKEBhEUIkBtAAwBdRKAAOGWKTykMODSAAeiAIwAOAGyUAzABY7AdgBMrmwFYAnHYA0IACeiK5WlK4Ooc7elq7entaWls4AvikBaJi4hCTkVLT0jCxsXCrqSCDauvqGxmYIVraOLu5evgHBDW7hkebe5p7KPg7eqekgmdj4RAx5lJg4FKj6TNzI7Ox0lKQQm5wyAPIAckeyImXGVXoGRhX1lp6WlIPOD8oOH67Krh2Idua2dzWBLOb4ubzvNIZdBTHKzCjzQxLFZQNYbLYFeFQGRIsDLG6cCCGKjkABuGAA1lRJtkZowqAtkeRUetNngaHQsTjFniajgEGSMKhkHyyhcKlc+XVENYIpRrOZnIqITFPOZXNZfl1vM8fJZRspRkDzHYoRMYbTcgjGbzmWi2YiefimITidscOSqZQadMrQzcc6Wej2TbAwKPUKRTcxWpLjprrU7hYAcpKM4Rt4IXY7MlFVr-s40xrPG5nHZrN9nGNoVlffD-U6UfaMZyirwLfhXQjBV6fXD6Y6matWS3Csz27W8OHycLRWpxVp41Kkw0U2mM1mc0rnFqBuZKMpD0f9a5nI9PJ40uMcBgIHBjH26Xk49UbtKEABaTVBRAfiJmx8-Q5McmFYDgXwTW5QHqSJd2cWwISSLc1UGVw7FcACO37OZQybEc8Ag5doL+V5KAcRJ0weBxkmohwtWsOwyMzTMAQiDVfHMTDJyfa0Azw4Ntl2MBCLfFcq1TQ9Xi+OwQXiHcfy6J4L0zQ1vm8L5kmrc1uKA3C7Xw4CuT40TF1fRNiIQSJbHImiqNsuiFIGTwDz1CFzHMJxQW8BwuNhHiGyHIMHT0pgRPM0xEEzWwKLVZQzy+H4FLiRigQSEtPALVxL3GQD60HW1hwEzE2ywsKoIihoZNcShkkGKwhgGax4N3YF7F8dxRk8YswSvFIgA */
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
            always: [
              {
                cond: (ctx) => !!ctx.currentAccount,
                target: 'idle',
              },
            ],
            invoke: {
              src: 'fetchIsConnected',
              onDone: [
                {
                  cond: (_, ev) => ev.data,
                  target: 'fetchingAccount',
                },
                { target: 'idle' },
              ],
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
      assignFuel: assign({
        fuel: (_, ev) => ev.value,
      }),
      assignAccount: assign({
        currentAccount: (_, ev) => ev.data,
      }),
    },
    services: {
      fetchAccount: (ctx) => ctx.fuel!.currentAccount(),
      fetchIsConnected: (ctx) => ctx.fuel!.isConnected(),
    },
  }
);

export type AccountMachine = typeof accountMachine;
export type AccountMachineService = InterpreterFrom<AccountMachine>;
export type AccountMachineState = StateFrom<AccountMachine>;
