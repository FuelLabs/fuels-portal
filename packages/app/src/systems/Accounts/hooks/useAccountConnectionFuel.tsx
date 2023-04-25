import { useSelector } from '@xstate/react';

import { useAccountFuelService } from '../components';
import type { AccountMachineState } from '../machines';

import { store } from '~/store';

export const useAccountConnectionFuel = () => {
  const service = useAccountFuelService();
  const isLoading = useSelector(service, (state: AccountMachineState) => {
    return state.hasTag('isLoading');
  });
  const currentAccount = service.getSnapshot().context.currentAccount;

  return {
    handlers: {
      connect: () => service.send('CONNECT'),
      disconnect: () => {},
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    fuel: service.getSnapshot().context.fuel,
    currentAccount,
    isConnected: !!currentAccount,
    isLoading,
  };
};
