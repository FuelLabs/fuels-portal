import { useMemo } from 'react';
import type { BridgeAsset } from '~/systems/Bridge/types';

import { ETH_ASSET, isSameEthAddress } from '../utils';

import { useAssets } from './useAssets';

export const useAsset = (params?: { address?: string }) => {
  const { address } = params || {};
  const { assets } = useAssets();

  const asset = useMemo((): BridgeAsset | undefined => {
    if (!address) {
      return ETH_ASSET;
    }

    const appAsset = assets.find(
      // is both addresses empty or equal
      (asset) =>
        (!asset.address && !address) || isSameEthAddress(asset.address, address)
    );

    return appAsset || undefined;
  }, [assets, address]);

  return {
    asset,
  };
};
