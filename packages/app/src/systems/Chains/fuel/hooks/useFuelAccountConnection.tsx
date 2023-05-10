import {
  useFuel,
  useConnect,
  useAccount,
  useDisconnect,
  useIsConnected,
} from '@fuels-portal/sdk-react';

import { store } from '~/store';

export const useFuelAccountConnection = () => {
  const fuel = useFuel();
  const { account } = useAccount();
  const { isConnected } = useIsConnected();
  const { connect, error, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect,
      disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    hasInstalledFuel: Boolean(fuel),
    account,
    isConnected,
    error,
    isConnecting,
  };
};
