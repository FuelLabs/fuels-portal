import { useMemo } from 'react';

import { BridgeStatus } from '../machines';

import { useBridge } from './useBridge';

export function useBridgeButton() {
  const { handlers, fromNetwork, toNetwork, status } = useBridge();

  const buttonText = useMemo(() => {
    if (status === BridgeStatus.waitingConnectFrom) {
      return status.replace('From', fromNetwork?.name || '');
    }

    if (status === BridgeStatus.waitingConnectTo) {
      return status.replace('To', toNetwork?.name || '');
    }

    if (status === BridgeStatus.ready) {
      return 'Bridge Asset';
    }

    return status;
  }, [status, fromNetwork, toNetwork]);

  const buttonAction = useMemo(() => {
    if (status === BridgeStatus.waitingConnectFrom) {
      return handlers.connectFrom;
    }

    if (status === BridgeStatus.waitingConnectTo) {
      return handlers.connectTo;
    }

    if (status === BridgeStatus.ready) {
      return handlers.startBridging;
    }

    return undefined;
  }, [status, handlers.startBridging]);

  return {
    buttonText,
    handlers: {
      buttonAction,
    },
  };
}
