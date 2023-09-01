import { useEffect } from 'react';

import type { BridgeTxsMachineState } from '../machines';

import { Services, store } from '~/store';
import {
  useEthAccountConnection,
  useFuelAccountConnection,
} from '~/systems/Chains';

const selectors = {
  bridgeTxs: (state: BridgeTxsMachineState) => {
    return state.context.bridgeTxs || [];
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

  useEffect(() => {
    if (!fuelProvider || !ethPublicClient || !fuelAddress) return;

    store.fetchTxs({ fuelProvider, ethPublicClient, fuelAddress });
  }, [fuelProvider, ethPublicClient, fuelAddress]);

  // TODO: put correct loading here
  const isLoading = false;
  // const isLoading = isEthToFuelLoading || isFuelToEthLoading;

  return {
    bridgeTxs,
    isLoading,
    shouldShowNotConnected: !isConnected && !isLoading,
    shouldShowEmpty: isConnected && !isLoading && bridgeTxs.length === 0,
    shouldShowList: !isLoading && isConnected && (bridgeTxs.length || 0) > 0,
  };
};
