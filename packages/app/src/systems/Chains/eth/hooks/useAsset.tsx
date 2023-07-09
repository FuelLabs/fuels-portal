import { useMemo } from 'react';

import { useAssets } from './useAssets';

export const useAsset = (params?: { address?: string }) => {
  const { address } = params || {};
  const { assets } = useAssets();

  const asset = useMemo(
    () =>
      assets.find(
        // is both addresses empty or equal
        (asset) => (!asset.assetId && !address) || asset.assetId === address
      ),
    [assets, address]
  );

  return {
    asset,
  };
};
