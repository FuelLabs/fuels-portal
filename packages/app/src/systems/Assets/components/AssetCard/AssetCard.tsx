import { cssObj } from '@fuel-ui/css';
import { Box, CardList, IconButton, Text } from '@fuel-ui/react';
import { RemoveAssetDialog } from '~/systems/Chains/eth/components';

import type { Asset } from '../../services';
import { AssetLogo } from '../AssetLogo';

type AssetCardProps = {
  asset: Asset;
  onAdd?: () => void;
  onPress?: () => void;
  onRemove?: () => void;
  onFaucet?: () => void;
  onAddToWallet?: () => void;
  isFaucetLoading?: boolean;
  isRemoveDisabled?: boolean;
  removeToolTip?: string;
};

export const AssetCard = ({
  asset,
  onAdd,
  onFaucet,
  isFaucetLoading,
  onPress,
  onRemove,
  onAddToWallet,
  isRemoveDisabled,
  removeToolTip,
}: AssetCardProps) => {
  return (
    <CardList.Item
      onPress={onPress}
      variant="outlined"
      css={styles.cardListItem}
    >
      <Box.Flex align="center" justify="space-between" css={{ width: '$full' }}>
        <Box.Flex gap="$3" align="center">
          <AssetLogo asset={asset} size={30} />
          <Box.Flex direction="column" gap="$0">
            <Text
              color="intentsPrimary12"
              aria-label={`${asset.symbol} symbol`}
            >
              {asset.symbol}
            </Text>
          </Box.Flex>
        </Box.Flex>
        <Box.Flex gap="$2">
          {onFaucet && (
            <IconButton
              aria-label="Faucet Eth Asset"
              variant="link"
              icon="Coins"
              tooltip="Get some tokens"
              onPress={onFaucet}
              size="lg"
              isLoading={isFaucetLoading}
              loadingText=" "
              css={styles.cardAction}
            />
          )}
          {onAdd && (
            <IconButton
              aria-label="Add Eth Asset"
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
            <RemoveAssetDialog assetSymbol={asset.symbol} onConfirm={onRemove}>
              <IconButton
                aria-label="Remove Eth Asset"
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
          {onAddToWallet && (
            <IconButton
              aria-label="Add Asset To Wallet"
              variant="link"
              icon="Wallet"
              onPress={onAddToWallet}
              tooltip="Add to wallet"
              size="lg"
              css={styles.cardAction}
            />
          )}
        </Box.Flex>
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
