import { Image, Avatar } from '@fuel-ui/react';
import { useMemo } from 'react';
import { ETH_CHAIN, FUEL_CHAIN } from '~/systems/Chains/config';

import type { Asset } from '../../services';
import { getAssetNetwork } from '../../utils';

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

    return {
      address: ethNetwork?.address || fuelNetwork?.assetId,
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
