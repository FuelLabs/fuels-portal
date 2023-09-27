import { useMemo } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';
import type { BridgeAsset } from '~/systems/Bridge/types';

import { ETH_ASSET } from '../utils';

import { useAssets } from './useAssets';

export const useAsset = (params?: { address?: string }) => {
  const { address } = params || {};
  const { assets } = useAssets();
  const { data: token } = useToken({
    address: isAddress(address || '') ? (address as `0x${string}`) : undefined,
  });

  const asset = useMemo((): BridgeAsset | undefined => {
    if (!address) {
      return ETH_ASSET;
    }
    const appAsset = assets.find(
      // is both addresses empty or equal
      (asset) => (!asset.address && !address) || asset.address === address
    );
    const webAsset = token
      ? {
          address: token?.address,
          decimals: token?.decimals,
          symbol: token?.symbol,
        }
      : undefined;

    return appAsset || webAsset || undefined;
  }, [assets, address, token]);

  return {
    asset,
  };
};
