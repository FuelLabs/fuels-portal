import { cssObj } from '@fuel-ui/css';
import { Box, CardList, Dialog, Icon, Text } from '@fuel-ui/react';

import { useAssets } from '../hooks';

import { store } from '~/store';
import { useBridge } from '~/systems/Bridge/hooks';

export function EthAssetsDialog() {
  const { assets } = useAssets();
  const { handlers: bridgeHandlers } = useBridge();

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Text color="intentsBase12" fontSize="sm">
            Select token
          </Text>
          <Dialog.Close />
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <CardList isClickable>
          {assets.map((asset, i) => (
            <CardList.Item
              key={asset.address + asset.symbol + String(i)}
              onClick={() =>
                bridgeHandlers.changeAssetAddress({
                  assetAddress: asset.address,
                })
              }
              css={styles.cardListItem}
            >
              {asset.symbol}
            </CardList.Item>
          ))}
        </CardList>
      </Dialog.Description>
      <Dialog.Footer css={styles.dialogFooter}>
        <Box.Flex onClick={store.openManageAssetsDialog}>
          <Icon icon="Edit" />
          <Text color="intentsBase12">Manage token list</Text>
        </Box.Flex>
      </Dialog.Footer>
    </>
  );
}

const styles = {
  dialogHeading: cssObj({
    borderBottom: '1px solid $intentsBase8',
  }),
  dialogHeadingContainer: cssObj({
    paddingBottom: '$4',
  }),
  actionButton: cssObj({
    width: '100%',
  }),
  cardListItem: cssObj({
    border: '1px solid $intentsBase8',
    borderRadius: '10px',
  }),
  dialogFooter: cssObj({
    borderTop: '1px solid $intentsBase8',
    justifyContent: 'center',
    paddingTop: '$4',
  }),
};
