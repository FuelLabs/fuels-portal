import { useEffect, useState } from 'react';

import type { FuelAccountMachineState } from '../machines';

import { useFuel } from './useFuel';
import { useIsConnected } from './useIsConnected';

import { Services, store } from '~/store';

const selectors = {
  isLoading: (state: FuelAccountMachineState) => state.hasTag('isLoading'),
};

export const useAccountConnectionFuel = () => {
  const fuel = useFuel();
  const isConnected = useIsConnected();

  useEffect(() => {
    if (fuel) {
      store.walletDetected(fuel);
    }
  }, [fuel]);

  const { context } = store.getStateFrom('fuelAccount');
  const currentAccount = context.currentAccount;

  useEffect(() => {
    if (!isConnected && currentAccount) {
      store.disconnect();
    }
  }, [isConnected]);

  const isLoading = store.useSelector(
    Services.fuelAccount,
    selectors.isLoading
  );

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
