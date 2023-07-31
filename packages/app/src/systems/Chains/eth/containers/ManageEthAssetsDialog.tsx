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
  IconButton,
  Avatar,
} from '@fuel-ui/react';
import { NativeAssetId } from 'fuels';
import { useState } from 'react';

import { useManageEthAssets } from '../hooks';

import { store } from '~/store';
import { shortAddress } from '~/systems/Core';

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
        <Box.Flex justify="space-between">
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
        </Box.Stack>
        <CardList>
          {showCustomTokenButton && (
            <CardList.Item variant="outlined" css={styles.cardListItem}>
              <Box.Flex justify="space-between" css={styles.actionButton}>
                <Box.Flex gap="$2" align="center">
                  <Icon icon="HelpOctagon" />
                  {shortAddress(newAssetAddress)}
                </Box.Flex>
                <IconButton
                  aria-label={newAssetAddress}
                  variant="ghost"
                  icon="CirclePlus"
                  onPress={() =>
                    store.openAddAssetsDialog({
                      assetAddress: newAssetAddress,
                    })
                  }
                  color="scaleGreen10"
                />
              </Box.Flex>
            </CardList.Item>
          )}
          {!showCustomTokenButton &&
            !showUseTokenButton &&
            assets.map((asset, i) => (
              <CardList.Item
                key={(asset.address || '') + (asset.symbol || '') + String(i)}
                variant="outlined"
                css={styles.cardListItem}
              >
                <Box.Flex justify="space-between" css={styles.actionButton}>
                  <Box.Flex gap="$2" align="center">
                    {asset.image ? (
                      <Image alt=" " src={asset.image} />
                    ) : (
                      <Avatar.Generated
                        size="xsm"
                        key={
                          (asset.address || '') +
                          (asset.symbol || '') +
                          String(i)
                        }
                        hash={
                          (asset.address || '') +
                          (asset.symbol || '') +
                          String(i)
                        }
                      />
                    )}

                    {asset.symbol}
                  </Box.Flex>
                  {asset.address !== NativeAssetId ? (
                    <IconButton
                      aria-label={(asset.address || '') + (asset.symbol || '')}
                      variant="ghost"
                      icon="SquareRoundedX"
                      onPress={() =>
                        handlers.removeAsset({ address: asset.address })
                      }
                      color="scalesRed10"
                    />
                  ) : (
                    <IconButton
                      aria-label={(asset.address || '') + (asset.symbol || '')}
                      isDisabled
                      tooltip="ETH is the native asset. It can't be removed."
                      variant="ghost"
                      icon="SquareRoundedX"
                      onPress={() =>
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
  actionButton: cssObj({
    width: '100%',
  }),
  cardListItem: cssObj({
    borderRadius: '10px',
  }),
  text: cssObj({
    fontSize: '$sm',
  }),
};
