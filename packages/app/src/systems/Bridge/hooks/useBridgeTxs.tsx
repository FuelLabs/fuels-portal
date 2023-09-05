import { useEffect } from 'react';
import { Services, store } from '~/store';
import {
  useEthAccountConnection,
  useFuelAccountConnection,
} from '~/systems/Chains';

import type { BridgeTxsMachineState } from '../machines';

const selectors = {
  bridgeTxs: (state: BridgeTxsMachineState) => {
    return state.context.bridgeTxs || [];
  },
  isLoading: (state: BridgeTxsMachineState) => {
    return state.hasTag('isLoading');
  },
};

export const useBridgeTxs = () => {
  const {
    isConnected,
    provider: fuelProvider,
    address: fuelAddress,
  } = useFuelAccountConnection();
  const { publicClient: ethPublicClient } = useEthAccountConnection();
  const bridgeTxs = store.useSelector(Services.bridgeTxs, selectors.bridgeTxs);
  const isLoading = store.useSelector(Services.bridgeTxs, selectors.isLoading);

  useEffect(() => {
    if (!fuelProvider || !ethPublicClient || !fuelAddress) return;

    store.fetchTxs({ fuelProvider, ethPublicClient, fuelAddress });
  }, [fuelProvider, ethPublicClient, fuelAddress]);

  return {
    bridgeTxs,
    isLoading,
    shouldShowNotConnected:
      !isConnected && !isLoading && bridgeTxs.length === 0,
    shouldShowEmpty: isConnected && !isLoading && bridgeTxs.length === 0,
    shouldShowList: !isLoading && isConnected && (bridgeTxs.length || 0) > 0,
  };
};
