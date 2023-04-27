import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';

import { store } from '~/store';

export function useAccountConnectionEth() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });

  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect,
      disconnect,
      closeDialog: store.closeOverlay,
    },
    address,
    ens: {
      name: ensName || undefined,
      avatar: ensAvatar || undefined,
    },
    isConnected,
    connectors,
    error,
    isLoading,
    pendingConnector,
  };
}
