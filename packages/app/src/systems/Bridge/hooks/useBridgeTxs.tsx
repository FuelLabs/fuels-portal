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
    isConnected,
    hasWallet,
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
    shouldShowNotConnected:
      !(isConnected ?? hasWallet) &&
      !isLoading &&
      bridgeTxs &&
      bridgeTxs.length === 0,
    shouldShowEmpty:
      isConnected && !isLoading && bridgeTxs && bridgeTxs.length === 0,
    shouldShowList:
      !isLoading && isConnected && ((bridgeTxs && bridgeTxs.length) || 0) > 0,
  };
};
