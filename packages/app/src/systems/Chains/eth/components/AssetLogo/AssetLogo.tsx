import { Image, Avatar } from '@fuel-ui/react';

type EthAssetLogoProps = {
  asset: {
    address?: string;
    image?: string;
  };
  size?: number;
  alt?: string;
};

const DEFAULT_SIZE = 18;

export const AssetLogo = ({
  alt = 'AssetLogo',
  asset,
  size = DEFAULT_SIZE,
}: EthAssetLogoProps) => {
  if (!asset?.image && !asset?.address) return null;

  return (
    <>
      {asset?.image ? (
        <Image width={size} height={size} src={asset?.image} alt={alt} />
      ) : (
        <Avatar.Generated size={size} hash={asset?.address || ''} />
      )}
    </>
  );
};
