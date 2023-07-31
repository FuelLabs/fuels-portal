import { cssObj } from '@fuel-ui/css';
import {
  Box,
  CardList,
  Dialog,
  Icon,
  Text,
  Image,
  Button,
  Avatar,
} from '@fuel-ui/react';

import { EthAssetCard } from '../components';
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
            <EthAssetCard
              key={`${asset.address || ''}${asset.symbol || ''}${String(i)}`}
              icon={
                asset.image ? (
                  <Image alt=" " src={asset.image} />
                ) : (
                  <Avatar.Generated
                    size="xsm"
                    key={
                      (asset.address || '') + (asset.symbol || '') + String(i)
                    }
                    hash={
                      (asset.address || '') + (asset.symbol || '') + String(i)
                    }
                  />
                )
              }
              name={asset.symbol || ''}
              onPress={() => {
                bridgeHandlers.changeAssetAddress({
                  assetAddress: asset.address,
                });
              }}
            />
          ))}
        </CardList>
      </Dialog.Description>
      <Dialog.Footer css={styles.dialogFooter}>
        <Button variant="ghost" onPress={store.openManageAssetsDialog}>
          <Icon icon="Edit" />
          <Text color="intentsBase12">Manage token list</Text>
        </Button>
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
    // border: '1px solid $intentsBase8',
    borderRadius: '10px',
  }),
  dialogFooter: cssObj({
    borderTop: '1px solid $intentsBase8',
    justifyContent: 'center',
    paddingTop: '$4',
  }),
};
