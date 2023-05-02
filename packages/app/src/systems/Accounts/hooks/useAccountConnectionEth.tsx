import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from 'wagmi';

export function useAccountConnectionEth() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: signer } = useSigner();

  const { connect, connectors, error, pendingConnector, isLoading } =
    useConnect();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect,
      disconnect,
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
    signer,
  };
}
