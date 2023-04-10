import type { JsonRpcSigner } from '@ethersproject/providers';
import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import { useAccount } from 'wagmi';
import { createMachine } from 'xstate';

export type ConnectWalletMachineContext = {
  nonFuelWallet?: ReturnType<typeof useAccount>;
  fuelWallet?: FuelWalletLocked;
};

type ConnectWalletMachineServices = {};

export type ConnectWalletMachineEvents =
  | { type: 'CONNECT_NON_FUEL_WALLET' }
  | { type: 'CONNECT_FUEL_WALLET' };

export const connectWalletMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./connectWalletMachine.typegen').Typegen0,
    schema: {
      context: {} as ConnectWalletMachineContext,
      services: {} as ConnectWalletMachineServices,
      events: {} as ConnectWalletMachineEvents,
    },
    id: 'connectWalletMachine',
    initial: 'checkingIsNonFuelWalletConnected',
    states: {
      checkingIsNonFuelWalletConnected: {
        invoke: {
          src: 'checkIsNonFuelWalletConnected',
          onDone: [
            {
              cond: 'isConnected',
              target: 'checkingIsFuelWalletConnected',
            },
            {
              target: 'waitingForWalletConnection',
            },
          ],
        },
      },
      checkingIsFuelWalletConnected: {
        invoke: {
          src: 'checkIsFuelWalletConnected',
          onDone: [
            {
              cond: 'isConnected',
              target: 'connected',
            },
            {
              target: 'waitingForWalletConnection',
            },
          ],
        },
      },
      waitingForWalletConnection: {
        on: {
          CONNECT_FUEL_WALLET: {
            target: 'connectingFuelWallet',
          },
          CONNECT_NON_FUEL_WALLET: {
            target: 'connectingNonFuelWallet',
          },
        },
      },
      connectingFuelWallet: {
        invoke: {
          src: 'connectFuelWallet',
          onDone: [{ target: 'connected' }],
        },
      },
      connectingNonFuelWallet: {
        invoke: {
          src: 'connectNonFuelWallet',
          onDone: [{ target: 'connected' }],
        },
      },
      connected: {},
    },
  },
  {
    guards: {
      isConnected: (_, ev) => ev.data,
    },
    services: {
      checkIsNonFuelWalletConnected: async (ctx) => {
        const isNonFuelWalletConnected = ctx.nonFuelWallet?.address;
        return !!isNonFuelWalletConnected;
      },
      checkIsFuelWalletConnected: async (ctx) => {
        const isFuelWalletConnected =
          ctx.fuelWallet &&
          (await ctx.fuelWallet.provider.walletConnection.isConnected());
        return !!isFuelWalletConnected;
      },
      connectNonFuelWallet: async (ctx) => {
        const nonFuelWallet = ctx.nonFuelWallet;
        await nonFuelWallet?.connector?.connect();
      },
      connectFuelWallet: async (ctx) => {
        const fuelWallet = ctx.fuelWallet;
        fuelWallet && (await fuelWallet.provider.walletConnection.connect());
      },
    },
  }
);
