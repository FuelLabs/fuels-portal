import { useModal } from 'connectkit';
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from 'wagmi';

export function useEthAccountConnection() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: signer } = useSigner();

  const { open: isConnecting, setOpen } = useModal();
  const { disconnect } = useDisconnect();

  return {
    handlers: {
      connect: () => setOpen(true),
      disconnect,
    },
    address,
    ens: {
      name: ensName || undefined,
      avatar: ensAvatar || undefined,
    },
    isConnected,
    isConnecting,
    signer: signer || undefined,
    provider: signer?.provider || undefined,
  };
}
