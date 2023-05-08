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
