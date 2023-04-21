import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { store } from '~/store';

export function useAccountConnectionEth() {
  const { address, isConnected } = useAccount();

  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect,
      disconnect,
      openAccountConnectionEth: store.openAccountConnectionEth,
      closeDialog: store.closeOverlay,
    },
    address,
    isConnected,
    connectors,
    error,
    isLoading,
    pendingConnector,
  };
}
