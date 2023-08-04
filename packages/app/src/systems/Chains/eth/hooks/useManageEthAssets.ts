import { useMemo } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';

import { useAssets } from './useAssets';

export const useManageEthAssets = (newAssetAddress: string) => {
  const { assets, handlers } = useAssets();

  const { data, isError, isLoading } = useToken({
    address: newAssetAddress as `0x${string}`,
  });

  const doesAssetAddressExist = useMemo(() => {
    return assets.find((asset) => asset.address === newAssetAddress);
  }, [assets, newAssetAddress]);

  const filteredAssets = useMemo(() => {
    const newAssetsArray = assets.filter((asset) =>
      asset.symbol?.toLowerCase().startsWith(newAssetAddress.toLowerCase())
    );
    if (!newAssetsArray.length) {
      return assets;
    }
    return newAssetsArray;
  }, [assets, newAssetAddress]);

  const isValid = useMemo(() => {
    return (
      (newAssetAddress.length !== 0 &&
        isAddress(newAssetAddress) &&
        !doesAssetAddressExist) ||
      newAssetAddress.length === 0
    );
  }, [newAssetAddress, doesAssetAddressExist]);

  return {
    assets: filteredAssets,
    handlers,
    showUseTokenButton: isValid && !isError && !!data,
    showCustomTokenButton: isError && !!newAssetAddress.length && isValid,
    doesAssetExist: !!doesAssetAddressExist,
    assetInfo: data,
    isLoading,
  };
};
