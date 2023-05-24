import { useModal } from 'connectkit';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';

import { publicClient } from '~/systems/Settings';

export function useEthAccountConnection() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: address });
  const { data: balance } = useBalance({ address });

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
    provider: publicClient || undefined,
    balance,
  };
}
