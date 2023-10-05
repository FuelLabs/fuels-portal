import { useMemo } from 'react';
import { ETH_CHAIN, FUEL_CHAIN } from '~/systems/Chains';

import { isSameEthAddress } from '../../Chains/eth/utils';
import type { Asset } from '../services/asset';
import { getAssetNetwork } from '../utils';

import { useAssets } from './useAssets';

export const useAsset = (params?: {
  ethTokenId?: string;
  fuelTokenId?: string;
}) => {
  const { ethTokenId, fuelTokenId } = params || {};
  const { assets } = useAssets();

  const asset = useMemo((): Asset | undefined => {
    // consider ETH as default asset
    if (!ethTokenId && !fuelTokenId) {
      return assets.find((asset) => asset.symbol === 'ETH');
    }

    const appAsset = assets.find((asset) => {
      const ethNetwork = getAssetNetwork({
        asset,
        chainId: ETH_CHAIN.id,
        networkType: 'ethereum',
      });
      const fuelNetwork = getAssetNetwork({
        asset,
        chainId: FUEL_CHAIN.chainId,
        networkType: 'fuel',
      });

      return (
        isSameEthAddress(ethNetwork?.address, ethTokenId) ||
        fuelNetwork?.assetId === fuelTokenId
      );
    });

    return appAsset || undefined;
  }, [assets, ethTokenId, fuelTokenId]);

  return {
    asset,
  };
};
