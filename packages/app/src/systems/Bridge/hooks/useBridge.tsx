import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { BridgeMachineState } from '../machines';
import { BridgeStatus } from '../machines';
import { getChainFromUrlParam, isEthChain, isFuelChain } from '../utils';

import { ETH_CHAIN, FUEL_CHAIN } from '~/config';
import { Services, store } from '~/store';
import { useAccountConnectionEth } from '~/systems/Accounts';
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
        return BridgeStatus.waitingConnectFrom.replace(
          'From',
          fromNetwork.name
        );
      if (
        (isEthChain(toNetwork) && !ethAddress) ||
        (isFuelChain(toNetwork) && !fuelAddress)
      )
        return BridgeStatus.waitingConnectTo.replace('To', toNetwork.name);

      return BridgeStatus.waitingAsset;
    },
};

export function useBridge() {
  const { address: ethAddress } = useAccountConnectionEth();
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

  return {
    handlers: {
      goToDeposit,
      goToWithdraw,
    },
    fromNetwork,
    toNetwork,
    isDeposit,
    isWithdraw,
    status,
  };
}
