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
import { Address, BaseAssetId } from 'fuels';
import { useMemo } from 'react';
import { VITE_ETH_ERC20, VITE_FUEL_FUNGIBLE_TOKEN_ID } from '~/config';
import { store } from '~/store';

import { EthTxCache, isSameEthAddress } from '../../eth';
import { FUEL_ASSETS } from '../utils/assets';
import { FuelTxCache } from '../utils/txCache';

export const useFuelAccountConnection = (props?: {
  erc20Address?: `0x${string}`;
}) => {
  const { erc20Address } = props || {};

  const { fuel } = useFuel();
  const { account } = useAccount();
  const { balance } = useBalance({ address: account || '' });
  const { isConnected } = useIsConnected();
  const { connect, error, isConnecting } = useConnector();
  const { disconnect } = useDisconnect();
  const { provider } = useProvider();
  const { wallet } = useWallet({ address: account || '' });

  // TODO: remove this workaround when we refactor assets to use package @fuels/assets
  // https://linear.app/fuel-network/issue/FRO-144/make-asset-list-package-public-and-publish-in-npm
  const asset = useMemo(() => {
    if (!erc20Address)
      return FUEL_ASSETS.find((asset) => asset.address === BaseAssetId);

    if (isSameEthAddress(erc20Address, VITE_ETH_ERC20))
      return FUEL_ASSETS.find(
        (asset) => asset.address === VITE_FUEL_FUNGIBLE_TOKEN_ID
      );

    return undefined;
  }, [erc20Address]);

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
    asset,
  };
};
