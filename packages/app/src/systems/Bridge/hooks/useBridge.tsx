import { bn } from 'fuels';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { BridgeMachineState } from '../machines';
import { BridgeStatus } from '../machines';
import { getChainFromUrlParam } from '../utils';

import { Services, store } from '~/store';
import type { SupportedChain } from '~/systems/Chains';
import {
  useEthAccountConnection,
  isEthChain,
  isFuelChain,
  ETH_CHAIN,
  FUEL_CHAIN,
} from '~/systems/Chains';
import { Pages } from '~/types';

const selectors = {
  fromNetwork: (state: BridgeMachineState) => state.context?.fromNetwork,
  toNetwork: (state: BridgeMachineState) => state.context?.toNetwork,
  status:
    ({
      ethAddress,
      fuelAddress,
    }: {
      ethAddress?: string;
      fuelAddress?: string;
    }) =>
    (state: BridgeMachineState) => {
      const { fromNetwork, toNetwork } = state.context;

      if (!fromNetwork) return BridgeStatus.waitingNetworkFrom;
      if (!toNetwork) return BridgeStatus.waitingNetworkTo;
      if (
        (isEthChain(fromNetwork) && !ethAddress) ||
        (isFuelChain(fromNetwork) && !fuelAddress)
      )
        return BridgeStatus.waitingConnectFrom;
      if (
        (isEthChain(toNetwork) && !ethAddress) ||
        (isFuelChain(toNetwork) && !fuelAddress)
      )
        return BridgeStatus.waitingConnectTo;

      return BridgeStatus.waitingAsset;
    },
  isLoading: (state: BridgeMachineState) => state.matches('bridging'),
};

export function useBridge() {
  const {
    address: ethAddress,
    signer: ethSigner,
    handlers: ethHandlers,
    isConnecting: ethIsConnecting,
  } = useEthAccountConnection();
  const fromNetwork = store.useSelector(Services.bridge, selectors.fromNetwork);
  const toNetwork = store.useSelector(Services.bridge, selectors.toNetwork);
  const status = store.useSelector(
    Services.bridge,
    selectors.status({ ethAddress })
  );

  const isDeposit = isFuelChain(toNetwork);
  const isWithdraw = isFuelChain(fromNetwork);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromInput = queryParams.get('from');
  const toInput = queryParams.get('to');

  useEffect(() => {
    if (!fromInput || !toInput) {
      goToDeposit();
    } else {
      const fromNetwork = getChainFromUrlParam(fromInput) || ETH_CHAIN;
      const toNetwork = isFuelChain(fromNetwork) ? ETH_CHAIN : FUEL_CHAIN;

      store.changeNetworks({ fromNetwork, toNetwork });
    }
  }, [fromInput, toInput]);

  function goToDeposit() {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('from', 'eth');
    searchParams.set('to', 'fuel');

    navigate({
      pathname: Pages.bridge,
      search: searchParams.toString(),
    });
  }

  function goToWithdraw() {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('from', 'fuel');
    searchParams.set('to', 'eth');

    navigate({
      pathname: Pages.bridge,
      search: searchParams.toString(),
    });
  }

  function startBridging() {
    // TODO: will need to get real value from InputAmount when implements from fuel-ui
    // Parse 18 units of ETH
    const amount = bn.parseUnits('0.1', 18);

    store.startBridging({
      amount,
      ethSigner,
    });
  }

  function connectNetwork(network?: SupportedChain) {
    if (isEthChain(network)) {
      ethHandlers.connect();
    }

    if (isFuelChain(network)) {
      // TODO: connect fruel
    }
  }

  function isLoadingConnectNetwork(network?: SupportedChain) {
    if (isEthChain(network)) {
      return ethIsConnecting;
    }

    if (isFuelChain(network)) {
      // TODO: return is connecting fuel
    }

    return false;
  }

  return {
    handlers: {
      goToDeposit,
      goToWithdraw,
      startBridging,
      connectFrom: () => connectNetwork(fromNetwork),
      connectTo: () => connectNetwork(toNetwork),
    },
    fromNetwork,
    toNetwork,
    isLoadingConnectFrom: isLoadingConnectNetwork(fromNetwork),
    isLoadingConnectTo: isLoadingConnectNetwork(toNetwork),
    isDeposit,
    isWithdraw,
    status,
  };
}
