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
import type { AssetFuel } from '~/systems/Assets/utils';

import { useHasFuelWallet } from './useHasFuelWallet';

export const useFuelAccountConnection = (props?: { assetId?: string }) => {
  const { assetId } = props || {};
  const { fuel } = useFuel();
  const { account } = useAccount();
  const { balance } = useBalance({
    address: account || '',
    assetId,
  });
  const { hasWallet } = useHasFuelWallet();
  const { isConnected, isLoading: isLoadingConnection } = useIsConnected();
  const { connect, error, isConnecting } = useConnector();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();
  const { wallet } = useWallet({ address: account || '' });

  const address = useMemo(
    () => (account ? Address.fromString(account) : undefined),
    [account]
  );

  function addAsset(asset: AssetFuel) {
    const { decimals, assetId, icon, symbol, name } = asset;

    fuel?.addAsset({
      assetId,
      imageUrl: icon,
      symbol,
      decimals,
      name,
    });
  }

  return {
    handlers: {
      connect,
      disconnect,
      closeDialog: store.closeOverlay,
      addAsset,
    },
    account,
    address,
    isConnected,
    error,
    hasWallet,
    isLoadingConnection,
    isConnecting,
    provider,
    balance,
    wallet,
  };
};
