import { cssObj } from '@fuel-ui/css';
import { Box, CardList, IconButton, Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type EthAssetCardProps = {
  icon: ReactNode;
  name: string;
  onAdd?: () => void;
  onPress?: () => void;
  onRemove?: () => void;
  isRemoveDisabled?: boolean;
  removeToolTip?: string;
};

export const EthAssetCard = ({
  icon,
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
        <Box.Flex gap="$2">
          {icon}
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
          />
        )}
        {onRemove && (
          <IconButton
            aria-label="RemoveEthAsset"
            isDisabled={isRemoveDisabled}
            tooltip={removeToolTip}
            variant="link"
            icon="SquareRoundedX"
            intent="error"
            size="xs"
            onPress={onRemove}
          />
        )}
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = {
  cardListItem: cssObj({
    alignSelf: 'stretch',
  }),
};
