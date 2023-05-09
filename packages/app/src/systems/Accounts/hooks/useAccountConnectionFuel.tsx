import {
  useFuel,
  useConnect,
  useAccount,
  useDisconnect,
  useIsConnected,
} from '@fuels-portal/sdk-react';

import { store } from '~/store';

export const useAccountConnectionFuel = () => {
  const fuel = useFuel();
  const { data: address } = useAccount();
  const { data: isConnected } = useIsConnected();
  const { handlers: connectHandlers, error, isLoading } = useConnect();
  const { handlers: disconnectHandlers } = useDisconnect();

  return {
    handlers: {
      connect: connectHandlers.connect,
      disconnect: disconnectHandlers.disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    hasInstalledFuel: Boolean(fuel),
    address,
    isConnected,
    error,
    isLoading,
  };
};
