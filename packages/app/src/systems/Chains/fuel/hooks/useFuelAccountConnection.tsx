import {
  useAccount,
  useDisconnect,
  useIsConnected,
  useProvider,
  useBalance,
  useWallet,
  useConnector,
  useFuel,
} from '@fuel-wallet/react';
import { Address } from 'fuels';
import { useMemo } from 'react';
import { store } from '~/store';

import { EthTxCache } from '../../eth';
import { FuelTxCache } from '../utils/txCache';

export const useFuelAccountConnection = (props?: { assetId?: string }) => {
  const { assetId } = props || {};

  const { fuel } = useFuel();
  const { account } = useAccount();
  const { balance } = useBalance({
    address: account || '',
    // TODO: remove this when fix https://linear.app/fuel-network/issue/FRO-613/balance-is-zero-for-token-on-fuel-side
    assetId: assetId ? undefined : undefined,
  });
  const { isConnected } = useIsConnected();
  const { connect, error, isConnecting } = useConnector();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();
  const { wallet } = useWallet({ address: account || '' });

  const address = useMemo(
    () => (account ? Address.fromString(account) : undefined),
    [account]
  );
  const hasWallet = Boolean(fuel);

  function handleConnect() {
    connect();
  }

  return {
    handlers: {
      connect: handleConnect,
      disconnect: () => {
        disconnect();
        EthTxCache.clean();
        FuelTxCache.clean();
      },
      closeDialog: store.closeOverlay,
    },
    hasWallet,
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
