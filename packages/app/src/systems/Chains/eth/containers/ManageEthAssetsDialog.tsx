import { cssObj } from '@fuel-ui/css';
import {
  Box,
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

import { EthAssetCard } from '../components';
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
        </Box.Stack>
        <CardList>
          {/* TODO test that ust token works */}
          {showUseTokenButton && (
            <EthAssetCard
              icon={
                <Avatar.Generated
                  size="xsm"
                  hash={(assetInfo?.address || '') + (assetInfo?.symbol || '')}
                />
              }
              name={assetInfo?.symbol || ''}
              onAdd={() => {
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
            />
          )}
          {showCustomTokenButton && (
            <EthAssetCard
              icon={<Icon icon="HelpOctagon" />}
              name={shortAddress(newAssetAddress)}
              onAdd={() =>
                store.openAddAssetsDialog({
                  assetAddress: newAssetAddress,
                })
              }
            />
          )}
          {!(showCustomTokenButton || showUseTokenButton) &&
            assets.map((asset, i) => (
              <EthAssetCard
                key={(asset.address || '') + (asset.symbol || '') + String(i)}
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
                removeIconButton={
                  asset.address !== NativeAssetId ? (
                    <IconButton
                      aria-label={(asset.address || '') + (asset.symbol || '')}
                      variant="ghost"
                      icon="SquareRoundedX"
                      color="scalesRed10"
                      onPress={() =>
                        handlers.removeAsset({ address: asset.address })
                      }
                    />
                  ) : (
                    <IconButton
                      aria-label={(asset.address || '') + (asset.symbol || '')}
                      isDisabled
                      tooltip="ETH is the native asset. It can't be removed."
                      variant="ghost"
                      icon="SquareRoundedX"
                      color="scalesRed10"
                    />
                  )
                }
              />
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
