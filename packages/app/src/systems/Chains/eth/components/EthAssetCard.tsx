import { cssObj } from '@fuel-ui/css';
import { Box, CardList, IconButton, Text, Image, Avatar } from '@fuel-ui/react';

type EthAssetCardProps = {
  imageSrc?: string;
  name: string;
  onAdd?: () => void;
  onPress?: () => void;
  onRemove?: () => void;
  isRemoveDisabled?: boolean;
  removeToolTip?: string;
};

export const EthAssetCard = ({
  imageSrc,
  name,
  onAdd,
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
          {imageSrc ? (
            <Image alt=" " src={imageSrc} />
          ) : (
            <Avatar.Generated size={20} hash={name} />
          )}
          <Text color="intentsPrimary12">{name}</Text>
        </Box.Flex>
        {onAdd && (
          <IconButton
            aria-label="AddEthAsset"
            variant="link"
            icon="CirclePlus"
            onPress={onAdd}
            intent="primary"
            size="xs"
            css={styles.cardAction}
          />
        )}
        {onRemove && (
          <IconButton
            aria-label="RemoveEthAsset"
            isDisabled={isRemoveDisabled}
            tooltip={removeToolTip}
            variant="link"
            icon="SquareRoundedX"
            intent={isRemoveDisabled ? 'base' : 'error'}
            size="xs"
            onPress={onRemove}
            css={styles.cardAction}
          />
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
