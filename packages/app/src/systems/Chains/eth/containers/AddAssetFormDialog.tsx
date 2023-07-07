import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog, Icon, Input, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { useAssets } from '../hooks';

import { store } from '~/store';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function AddAssetFormDialog() {
  const { metadata } = useOverlay<{ assetAddress: string }>();
  const { addAsset } = useAssets();

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [tokenImageSource, setTokenImageSource] = useState('');

  return (
    <>
      <Dialog.Heading>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Icon icon="ArrowLeft" onClick={store.openManageAssetsDialog} />
          <Text color="intentsBase12" fontSize="sm">
            Add token {shortAddress(metadata.assetAddress)}
          </Text>
          <Box>
            <Dialog.Close />
          </Box>
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack>
          <Input size="md" css={{ fontSize: '$sm' }}>
            <Input.Field
              placeholder="Token symbol"
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </Input>
          <Input size="md" css={{ fontSize: '$sm' }}>
            <Input.Number
              placeholder="Token decimals"
              onChange={(e) => setTokenDecimals(e.target.value)}
            />
          </Input>
          <Input size="md" css={{ fontSize: '$sm' }}>
            <Input.Field
              placeholder="Token image source"
              onChange={(e) => setTokenImageSource(e.target.value)}
            />
          </Input>
          <Button
            size="sm"
            onPress={() =>
              addAsset({
                asset: {
                  address: metadata.assetAddress,
                  image: tokenImageSource,
                  decimals: Number(tokenDecimals),
                  symbol: tokenSymbol,
                },
              })
            }
          >
            Add token to list
          </Button>
        </Box.Stack>
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
