import {
  useFuel,
  useConnect,
  useAccount,
  useDisconnect,
  useIsConnected,
  useProvider,
} from '@fuels-portal/sdk-react';
import { Address } from 'fuels';
import { useMemo } from 'react';

import { store } from '~/store';

export const useFuelAccountConnection = () => {
  const fuel = useFuel();
  const { account } = useAccount();
  const { isConnected } = useIsConnected();
  const { connect, error, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();

  const address = useMemo(
    () => (account ? Address.fromString(account) : undefined),
    [account]
  );

  return {
    handlers: {
      connect,
      disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    hasInstalledFuel: Boolean(fuel),
    account,
    address,
    isConnected,
    error,
    isConnecting,
    provider,
  };
};
