import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  CardList,
  Dialog,
  Icon,
  Input,
  Text,
} from '@fuel-ui/react';
import { useState } from 'react';

import { useAssets } from '../hooks';

import { store } from '~/store';
import { useBridge } from '~/systems/Bridge/hooks';

export function ManageEthAssetsDialog() {
  const { assets, removeAsset } = useAssets();
  const { handlers: bridgeHandlers } = useBridge();
  const [newAssetAddress, setNewAssetAddress] = useState('');

  return (
    <>
      <Dialog.Heading>
        <Box.Stack>
          <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
            <Icon icon="ArrowLeft" onClick={store.openEthAssetsDialog} />
            <Text color="intentsBase12" fontSize="sm">
              Manage token list
            </Text>
            <Box>
              <Dialog.Close />
            </Box>
          </Box.Flex>
          <Input size="md" css={{ fontSize: '$sm' }}>
            <Input.Field
              placeholder="Paste custom address"
              onChange={(e) => setNewAssetAddress(e.target.value)}
              value={newAssetAddress}
            />
          </Input>
          {!!newAssetAddress.length && (
            <Button
              size="sm"
              onPress={() =>
                store.openAddAssetsDialog({
                  assetAddress: newAssetAddress,
                })
              }
            >
              Add token
            </Button>
          )}
        </Box.Stack>
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
              <Box.Flex justify="space-between" css={{ width: '100%' }}>
                {asset.symbol}
                <Icon
                  icon="SquareRoundedX"
                  onClick={() => removeAsset({ address: asset.address })}
                />
              </Box.Flex>
            </CardList.Item>
          ))}
        </CardList>
      </Dialog.Description>
    </>
  );
}

const styles = {
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
