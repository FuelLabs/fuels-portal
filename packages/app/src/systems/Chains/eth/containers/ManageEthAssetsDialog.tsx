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
import { NativeAssetId } from 'fuels';
import { useState } from 'react';

import { useManageEthAssets } from '../hooks';

import { store } from '~/store';

export function ManageEthAssetsDialog() {
  const [newAssetAddress, setNewAssetAddress] = useState('');

  const {
    assets,
    handlers,
    showCustomTokenButton,
    showUseTokenButton,
    isAddressValid,
    doesAssetExist,
    assetInfo,
  } = useManageEthAssets(newAssetAddress);

  return (
    <>
      <Dialog.Heading>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Icon icon="ArrowLeft" onClick={store.openEthAssetsDialog} />
          <Text color="intentsBase12" fontSize="sm">
            Manage token list
          </Text>
          <Box>
            <Dialog.Close />
          </Box>
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack css={{ pb: '$2' }}>
          <Form.Control isInvalid={!isAddressValid}>
            <Input size="md" css={styles.text}>
              <Input.Field
                placeholder="Paste custom address"
                onChange={(e) => setNewAssetAddress(e.target.value)}
                value={newAssetAddress}
              />
            </Input>
            <Form.ErrorMessage>
              {`Please enter a valid address.${
                doesAssetExist ? '  This address has already been added.' : ''
              }`}
            </Form.ErrorMessage>
          </Form.Control>
          {showUseTokenButton && (
            <Button
              size="sm"
              onPress={() => {
                handlers.addAsset({
                  asset: {
                    address: assetInfo?.address,
                    decimals: assetInfo?.decimals,
                    symbol: assetInfo?.symbol,
                  },
                });
                store.openManageAssetsDialog();
                setNewAssetAddress('');
              }}
            >
              Add token
            </Button>
          )}
          {showCustomTokenButton && (
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
        <CardList>
          {assets.map((asset, i) => (
            <CardList.Item
              key={(asset.address || '') + (asset.symbol || '') + String(i)}
              variant="outlined"
              css={styles.cardListItem}
            >
              <Box.Flex justify="space-between" css={styles.actionButton}>
                <Box.Flex gap="$2" align="center">
                  <Image alt=" " src={asset.image} />
                  {asset.symbol}
                </Box.Flex>
                {asset.address !== NativeAssetId && (
                  <Icon
                    icon="SquareRoundedX"
                    onClick={() =>
                      handlers.removeAsset({ address: asset.address })
                    }
                    color="scalesRed10"
                  />
                )}
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
    // paddingBottom: '$4',
  }),
  actionButton: cssObj({
    width: '100%',
  }),
  cardListItem: cssObj({
    // border: '1px solid $intentsBase8',
    borderRadius: '10px',
  }),
  text: cssObj({
    fontSize: '$sm',
  }),
};
