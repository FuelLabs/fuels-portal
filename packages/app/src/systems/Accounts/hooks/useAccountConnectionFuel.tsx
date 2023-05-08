import {
  useFuel,
  useConnect,
  useAccount,
  useDisconnect,
} from '@fuels-portal/sdk-react';

import { store } from '~/store';

export const useAccountConnectionFuel = () => {
  const fuel = useFuel();
  const { address, isConnected } = useAccount();
  const { connect, error, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect,
      disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    fuel,
    address,
    isConnected,
    error,
    isLoading,
  };
};
