import type { BN } from 'fuels';
import { bn, DECIMAL_UNITS } from 'fuels';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { BridgeMachineState } from '../machines';
import { BridgeStatus } from '../machines';
import { getChainFromUrlParam } from '../utils';

import { Services, store } from '~/store';
import type { SupportedChain } from '~/systems/Chains';
import {
  useFuelAccountConnection,
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
      ethAccount,
      fuelAccount,
      assetBalance,
    }: {
      ethAccount?: string;
      fuelAccount?: string;
      assetBalance?: BN;
    }) =>
    (state: BridgeMachineState) => {
      const { fromNetwork, toNetwork } = state.context;

      if (!fromNetwork) return BridgeStatus.waitingNetworkFrom;
      if (!toNetwork) return BridgeStatus.waitingNetworkTo;
      if (
        (isEthChain(fromNetwork) && !ethAccount) ||
        (isFuelChain(fromNetwork) && !fuelAccount)
      )
        return BridgeStatus.waitingConnectFrom;
      if (
        (isEthChain(toNetwork) && !ethAccount) ||
        (isFuelChain(toNetwork) && !fuelAccount)
      )
        return BridgeStatus.waitingConnectTo;

      if (!state.context?.assetAmount) {
        return BridgeStatus.waitingAssetAmount;
      }

      if (state.context.assetAmount.gt(assetBalance || bn(0))) {
        return BridgeStatus.insufficientBalance;
      }

      return BridgeStatus.ready;
    },
  isLoading: (state: BridgeMachineState) => state.matches('bridging'),
  assetAmount: (state: BridgeMachineState) => state.context?.assetAmount,
};

export function useBridge() {
  const {
    address: ethAddress,
    signer: ethSigner,
    handlers: ethHandlers,
    isConnecting: ethIsConnecting,
    balance: ethBalance,
  } = useEthAccountConnection();
  const {
    account: fuelAccount,
    address: fuelAddress,
    handlers: fuelHandlers,
    isConnecting: fuelIsConnecting,
  } = useFuelAccountConnection();
  const fromNetwork = store.useSelector(Services.bridge, selectors.fromNetwork);
  const toNetwork = store.useSelector(Services.bridge, selectors.toNetwork);
  const isLoading = store.useSelector(Services.bridge, selectors.isLoading);
  const assetAmount = store.useSelector(Services.bridge, selectors.assetAmount);
  const isDeposit = isFuelChain(toNetwork);
  const isWithdraw = isFuelChain(fromNetwork);
  const assetBalance = useMemo(() => {
    if (isEthChain(fromNetwork)) {
      if (ethBalance) {
        const [intPart, decimalPart] = ethBalance?.formatted?.split('.') || [];
        const formattedUnits = `${intPart}.${decimalPart.slice(
          0,
          DECIMAL_UNITS
        )}`;
        return ethBalance ? bn.parseUnits(formattedUnits) : undefined;
      }
    }

    if (isFuelChain(fromNetwork)) {
      // TODO: put correct fuel balance (when doing FUEL -> ETH bridge)
      // return fuelAccount?.balance;
    }

    return undefined;
  }, [ethBalance, fromNetwork]);
  const status = store.useSelector(
    Services.bridge,
    selectors.status({ ethAccount: ethAddress, fuelAccount, assetBalance })
  );

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

  function connectNetwork(network?: SupportedChain) {
    if (isEthChain(network)) {
      ethHandlers.connect();
    }

    if (isFuelChain(network)) {
      fuelHandlers.connect();
    }
  }

  function isLoadingConnectNetwork(network?: SupportedChain) {
    if (isEthChain(network)) {
      return ethIsConnecting;
    }

    if (isFuelChain(network)) {
      return fuelIsConnecting;
    }

    return false;
  }

  return {
    handlers: {
      goToDeposit,
      goToWithdraw,
      startBridging: () =>
        store.startBridging({
          ethSigner,
          fuelAddress,
        }),
      connectFrom: () => connectNetwork(fromNetwork),
      connectTo: () => connectNetwork(toNetwork),
      changeAssetAmount: store.changeAssetAmount,
    },
    fromNetwork,
    toNetwork,
    isLoading,
    isLoadingConnectFrom: isLoadingConnectNetwork(fromNetwork),
    isLoadingConnectTo: isLoadingConnectNetwork(toNetwork),
    isDeposit,
    isWithdraw,
    status,
    assetAmount,
    assetBalance,
  };
}
