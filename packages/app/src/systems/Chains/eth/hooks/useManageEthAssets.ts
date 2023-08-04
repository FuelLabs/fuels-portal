import { useMemo } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';

import { useAssets } from './useAssets';

export const useManageEthAssets = (newAssetAddress: string) => {
  const { assets, handlers } = useAssets();

  const { data, isError, isLoading } = useToken({
    address: newAssetAddress as `0x${string}`,
  });

  const { filteredAssets, doesAssetExist } = useMemo(() => {
    const isValidAddress = isAddress(newAssetAddress);
    if (isValidAddress) {
      const filteredAssets = assets.filter(
        (asset) => asset.address === newAssetAddress
      );
      return { filteredAssets, doesAssetExist: filteredAssets.length };
    }
    const newAssetsArray = assets.filter((asset) =>
      asset.symbol?.toLowerCase().startsWith(newAssetAddress.toLowerCase())
    );
    if (!newAssetsArray.length) {
      return { filteredAssets: assets, doesAssetExist: false };
    }
    return { filteredAssets: newAssetsArray, doesAssetExist: true };
  }, [assets, newAssetAddress]);

  return {
    assets: filteredAssets,
    handlers,
    showUseTokenButton: !isError && !!data && !doesAssetExist,
    showCustomTokenButton:
      isError &&
      !!newAssetAddress.length &&
      isAddress(newAssetAddress) &&
      !doesAssetExist,
    assetInfo: data,
    isLoading: isLoading && isAddress(newAssetAddress) && !doesAssetExist,
    doesAssetExist,
  };
};
