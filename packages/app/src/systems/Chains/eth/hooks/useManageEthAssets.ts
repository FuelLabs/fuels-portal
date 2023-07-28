import { useMemo } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';

import { useAssets } from './useAssets';

export const useManageEthAssets = (newAssetAddress: string) => {
  const { assets, handlers } = useAssets();

  const { data, isError } = useToken({
    address: newAssetAddress as `0x${string}`,
  });

  const doesAssetExist = useMemo(() => {
    return assets.find((asset) => asset.address === newAssetAddress);
  }, [assets, newAssetAddress]);

  const isValid = useMemo(() => {
    return (
      (newAssetAddress.length !== 0 &&
        isAddress(newAssetAddress) &&
        !doesAssetExist) ||
      newAssetAddress.length === 0
    );
  }, [newAssetAddress, doesAssetExist]);

  return {
    assets,
    handlers,
    showUseTokenButton: isValid && !isError && !!data,
    showCustomTokenButton: isError && !!newAssetAddress.length && isValid,
    isAddressValid: isValid,
    doesAssetExist,
    assetInfo: data,
  };
};
