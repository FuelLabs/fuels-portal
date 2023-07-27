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
import { useMemo, useState } from 'react';
import { isAddress } from 'viem';
import { useToken } from 'wagmi';

import { useAssets } from '../hooks';

import { store } from '~/store';

export function ManageEthAssetsDialog() {
  const { assets, handlers } = useAssets();
  const [newAssetAddress, setNewAssetAddress] = useState('');

  const { data, isError } = useToken({
    address: newAssetAddress as `0x${string}`,
  });

  const doesAssetExist = useMemo(() => {
    return assets.find((asset) => asset.address === newAssetAddress);
  }, [assets, newAssetAddress]);

  const isValid = useMemo(() => {
    return (
      (newAssetAddress.length !== 0 &&
        isAddress(newAssetAddress) &&
        !doesAssetExist) ||
      newAssetAddress.length === 0
    );
  }, [newAssetAddress, doesAssetExist]);

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
          <Form.Control isInvalid={!isValid}>
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
          {!isError && !!data && isValid && (
            <Button
              size="sm"
              onPress={() => {
                handlers.addAsset({
                  asset: {
                    address: data?.address,
                    decimals: data?.decimals,
                    symbol: data?.symbol,
                  },
                });
                store.openManageAssetsDialog();
                setNewAssetAddress('');
              }}
            >
              Add token
            </Button>
          )}
          {isError && !!newAssetAddress.length && isValid && (
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
