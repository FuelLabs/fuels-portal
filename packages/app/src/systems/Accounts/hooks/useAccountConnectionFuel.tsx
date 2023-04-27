import { useEffect } from 'react';

import type { FuelAccountMachineState } from '../machines';

import { useFuel } from './useFuel';

import { Services, store } from '~/store';

const selectors = {
  isLoading: (state: FuelAccountMachineState) => state.hasTag('isLoading'),
};

export const useAccountConnectionFuel = () => {
  const fuel = useFuel();
  useEffect(() => {
    if (fuel) {
      store.walletDetected(fuel);
    }
  }, [fuel]);
  const isLoading = store.useSelector(
    Services.fuelAccount,
    selectors.isLoading
  );
  const { context } = store.getStateFrom('fuelAccount');
  const currentAccount = context.currentAccount;

  return {
    handlers: {
      connect: store.connect,
      disconnect: store.disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    fuel: context.fuel,
    currentAccount,
    isConnected: !!currentAccount,
    isLoading,
  };
};
