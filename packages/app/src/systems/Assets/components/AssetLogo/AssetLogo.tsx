import { Image, Avatar } from '@fuel-ui/react';
import { useMemo } from 'react';

import type { Asset } from '../../services';
import { getAssetEth, getAssetFuel } from '../../utils';

type EthAssetLogoProps = {
  asset?: Asset;
  size?: number;
  alt?: string;
};

const DEFAULT_SIZE = 18;

export const AssetLogo = ({
  alt = 'AssetLogo',
  asset,
  size = DEFAULT_SIZE,
}: EthAssetLogoProps) => {
  const { image, address } = useMemo(() => {
    if (asset?.icon) {
      return { image: asset.icon };
    }

    if (!asset) return {};

    const ethAsset = getAssetEth(asset);
    const fuelAsset = getAssetFuel(asset);

    return {
      address: ethAsset?.address || fuelAsset?.assetId || fuelAsset?.contractId,
    };
  }, [asset?.symbol]);

  if (!image && !address) return null;

  return (
    <>
      {image ? (
        <Image width={size} height={size} src={image} alt={alt} />
      ) : (
        <Avatar.Generated size={size} hash={address || ''} />
      )}
    </>
  );
};
