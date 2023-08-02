import { cssObj } from '@fuel-ui/css';
import { Box, CardList, IconButton } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type EthAssetCardProps = {
  icon: ReactNode;
  name: string;
  onAdd?: () => void;
  onPress?: () => void;
  removeIconButton?: ReactNode;
};

export const EthAssetCard = ({
  icon,
  name,
  onAdd,
  onPress,
  removeIconButton,
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
          {name}
        </Box.Flex>
        {onAdd && (
          <IconButton
            aria-label="AddEthAsset"
            variant="ghost"
            icon="CirclePlus"
            onPress={onAdd}
            color="scalesGreen10"
            size="xs"
          />
        )}
        {removeIconButton}
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = {
  cardListItem: cssObj({
    borderRadius: '10px',
    alignSelf: 'stretch',
  }),
};
