import { useMemo } from 'react';

import { BridgeStatus } from '../machines';

import { useBridge } from './useBridge';

export function useBridgeButton() {
  const {
    handlers,
    fromNetwork,
    toNetwork,
    status,
    isLoading,
    isLoadingConnectFrom,
    isLoadingConnectTo,
  } = useBridge();

  // TODO: add isDisabled for choose asset/amount situation
  const button = useMemo(() => {
    if (status === BridgeStatus.waitingConnectFrom) {
      return {
        text: status.replace('From', fromNetwork?.name || ''),
        isLoading: isLoadingConnectFrom,
        action: handlers.connectFrom,
      };
    }

    if (status === BridgeStatus.waitingConnectTo) {
      return {
        text: status.replace('To', toNetwork?.name || ''),
        isLoading: isLoadingConnectTo,
        action: handlers.connectTo,
      };
    }

    // TODO: remove when InputAmount is insert
    if (
      status === BridgeStatus.ready ||
      status === BridgeStatus.waitingAsset ||
      status === BridgeStatus.waitingAssetAmount
    ) {
      // if (status === BridgeStatus.ready) {
      return {
        text: status,
        isLoading,
        action: handlers.startBridging,
      };
    }

    return {
      text: status,
    };
  }, [
    status,
    fromNetwork,
    toNetwork,
    handlers.startBridging,
    handlers.connectFrom,
    handlers.connectTo,
    isLoadingConnectFrom,
    isLoadingConnectTo,
  ]);

  const { action, ...bridgeButton } = button;

  return {
    ...bridgeButton,
    handlers: {
      action,
    },
  };
}