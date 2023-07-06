import { useModal } from 'connectkit';
import { useEffect } from 'react';
import { isAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  usePublicClient,
  useWalletClient,
} from 'wagmi';

import { TxEthToFuelService } from '../services';
import { parseEthAddressToFuel } from '../utils';

import { useAsset } from './useAsset';

let i = 0;

export function useEthAccountConnection(props?: {
  erc20Address?: `0x${string}`;
}) {
  const { erc20Address } = props || {};
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: address });
  const { data: balance } = useBalance({ address, token: erc20Address });
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { asset } = useAsset({
    address: erc20Address && isAddress(erc20Address) ? erc20Address : undefined,
  });

  const { open: isConnecting, setOpen } = useModal();
  const { disconnect } = useDisconnect();
  const paddedAddress = parseEthAddressToFuel(address);

  // TODO: this is triggering many times, should do probably using machine
  // useEffect(() => {
  //   if (walletClient && asset?.address) {
  //     walletClient.watchAsset({
  //       type: 'ERC20',
  //       options: asset,
  //     });
  //   }
  // }, [walletClient, asset?.address]);

  // TODO: should remove this useEffect when we have erc20 contracts in l1_chain
  useEffect(() => {
    if (walletClient && publicClient) {
      if (i) return;

      // eslint-disable-next-line no-plusplus
      i++;

      TxEthToFuelService.createErc20Contract({
        ethWalletClient: walletClient,
        ethPublicClient: publicClient,
      });
    }
  }, [walletClient, publicClient]);

  return {
    handlers: {
      connect: () => setOpen(true),
      disconnect,
    },
    address,
    paddedAddress,
    ens: {
      name: ensName || undefined,
      avatar: ensAvatar || undefined,
    },
    isConnected,
    isConnecting,
    signer: walletClient || undefined,
    walletClient: walletClient || undefined,
    provider: publicClient || undefined,
    publicClient: publicClient || undefined,
    balance,
    asset,
  };
}
