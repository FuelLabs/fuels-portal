import { cssObj } from '@fuel-ui/css';
import { Box, CardList, IconButton, Text } from '@fuel-ui/react';

import { AssetLogo } from '../AssetLogo';
import { RemoveAssetDialog } from '../RemoveAssetDialog';

type EthAssetCardProps = {
  imageSrc?: string;
  name: string;
  hash?: string;
  onAdd?: () => void;
  onPress?: () => void;
  onRemove?: () => void;
  onFaucet?: () => void;
  isRemoveDisabled?: boolean;
  removeToolTip?: string;
};

export const EthAssetCard = ({
  imageSrc,
  name,
  hash,
  onAdd,
  onFaucet,
  onPress,
  onRemove,
  isRemoveDisabled,
  removeToolTip,
}: EthAssetCardProps) => {
  return (
    <CardList.Item
      onPress={onPress}
      variant="outlined"
      css={styles.cardListItem}
    >
      <Box.Flex align="center" justify="space-between" css={{ width: '$full' }}>
        <Box.Flex gap="$2" align="center">
          <AssetLogo asset={{ address: hash, image: imageSrc }} size={20} />
          <Text color="intentsPrimary12">{name}</Text>
        </Box.Flex>
        {onFaucet && (
          <IconButton
            aria-label="AddEthAsset"
            variant="link"
            icon="Coins"
            tooltip="Get some tokens"
            onPress={onFaucet}
            size="lg"
            css={styles.cardAction}
          />
        )}
        {onAdd && (
          <IconButton
            aria-label="AddEthAsset"
            variant="link"
            icon="CirclePlus"
            onPress={onAdd}
            tooltip="Add asset"
            intent="primary"
            size="lg"
            css={styles.cardAction}
          />
        )}
        {onRemove && (
          <RemoveAssetDialog assetSymbol={name} onConfirm={onRemove}>
            <IconButton
              aria-label="RemoveEthAsset"
              isDisabled={isRemoveDisabled}
              tooltip={removeToolTip}
              variant="link"
              icon="SquareRoundedX"
              intent={isRemoveDisabled ? 'base' : 'error'}
              size="lg"
              css={styles.cardAction}
            />
          </RemoveAssetDialog>
        )}
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = {
  cardListItem: cssObj({
    alignSelf: 'stretch',
    flexDirection: 'row',
  }),
  cardAction: cssObj({
    p: '0px',
  }),
};
