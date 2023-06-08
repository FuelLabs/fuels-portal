import {
  useFuel,
  useConnect,
  useAccount,
  useDisconnect,
  useIsConnected,
  useProvider,
  useBalance,
  useWallet,
} from '@fuels-portal/sdk-react';
import { Address } from 'fuels';
import { useMemo } from 'react';

import { store } from '~/store';

export const useFuelAccountConnection = () => {
  const { fuel } = useFuel();
  const { account } = useAccount();
  const { balance } = useBalance({ address: account || '' });
  const { isConnected } = useIsConnected();
  const { connect, error, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();
  const { wallet } = useWallet({ address: account || '' });

  const address = useMemo(
    () => (account ? Address.fromString(account) : undefined),
    [account]
  );
  const hasInstalledFuel = Boolean(fuel);

  function handleConnect() {
    if (hasInstalledFuel) {
      connect();
    } else {
      store.openFuelInstall();
    }
  }

  return {
    handlers: {
      connect: handleConnect,
      disconnect,
      openFuelInstall: store.openFuelInstall,
      closeDialog: store.closeOverlay,
    },
    hasInstalledFuel,
    account,
    address,
    isConnected,
    error,
    isConnecting,
    provider,
    balance,
    wallet,
  };
};
