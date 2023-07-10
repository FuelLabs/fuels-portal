import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  CardList,
  Dialog,
  Icon,
  Image,
  Input,
  Text,
  Form,
} from '@fuel-ui/react';
import { useMemo, useState } from 'react';
import { isAddress } from 'viem';

import { useAssets } from '../hooks';

import { store } from '~/store';

export function ManageEthAssetsDialog() {
  const { assets, removeAsset } = useAssets();
  const [newAssetAddress, setNewAssetAddress] = useState('');

  const isValid = useMemo(() => {
    return (
      (newAssetAddress.length !== 0 && isAddress(newAssetAddress)) ||
      newAssetAddress.length === 0
    );
  }, [newAssetAddress]);

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
          <Form.Control isInvalid={!isValid}>
            <Input size="md" css={{ fontSize: '$sm' }}>
              <Input.Field
                placeholder="Paste custom address"
                onChange={(e) => setNewAssetAddress(e.target.value)}
                value={newAssetAddress}
              />
            </Input>
            <Form.ErrorMessage>Please enter a valid address</Form.ErrorMessage>
          </Form.Control>
          {!!newAssetAddress.length && isValid && (
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
        <CardList>
          {assets.map((asset, i) => (
            <CardList.Item
              key={asset.address + asset.symbol + String(i)}
              css={styles.cardListItem}
            >
              <Box.Flex justify="space-between" css={{ width: '100%' }}>
                <Box.Flex gap="$2" align="center">
                  <Image alt=" " src={asset.image} />
                  {asset.symbol}
                </Box.Flex>
                <Icon
                  icon="SquareRoundedX"
                  onClick={() => removeAsset({ address: asset.address })}
                  color="scalesRed10"
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
