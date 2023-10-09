import { useEffect } from 'react';
import { Services, store } from '~/store';
import {
  useEthAccountConnection,
  useFuelAccountConnection,
} from '~/systems/Chains';

import type { BridgeTxsMachineState } from '../machines';

const selectors = {
  bridgeTxs: (state: BridgeTxsMachineState) => {
    return state.context.bridgeTxs;
  },
  isLoading: (state: BridgeTxsMachineState) => {
    return state.hasTag('isLoading');
  },
};

export const useBridgeTxs = () => {
  const {
    hasWallet,
    isConnected,
    isLoadingConnection,
    provider: fuelProvider,
    address: fuelAddress,
  } = useFuelAccountConnection();
  const { publicClient: ethPublicClient } = useEthAccountConnection();
  const bridgeTxs = store.useSelector(Services.bridgeTxs, selectors.bridgeTxs);
  const isLoading = store.useSelector(Services.bridgeTxs, selectors.isLoading);

  useEffect(() => {
    if (!fuelProvider || !ethPublicClient || !fuelAddress) return;

    store.fetchTxs({ fuelProvider, ethPublicClient, fuelAddress });
  }, [fuelProvider?.url, ethPublicClient.chain.id, fuelAddress?.toAddress()]);
  return {
    bridgeTxs,
    isLoading,
    shouldShowNotConnected: hasWallet
      ? !isLoadingConnection && !isConnected && !isLoading
      : !hasWallet,
    shouldShowEmpty:
      isConnected && !isLoading && bridgeTxs && bridgeTxs.length === 0,
    shouldShowList:
      !isLoading && isConnected && ((bridgeTxs && bridgeTxs.length) || 0) > 0,
  };
};
