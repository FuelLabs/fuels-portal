import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog, Icon, Input, Text, Form } from '@fuel-ui/react';
import { useState } from 'react';

import { useAssets } from '../hooks';

import { store } from '~/store';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function AddAssetFormDialog() {
  const { metadata } = useOverlay<{ assetAddress: string }>();
  const { handlers } = useAssets();

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
          <Form.Control isRequired>
            <Form.Label css={styles.text}>Token symbol</Form.Label>
            <Input size="md" css={styles.text}>
              <Input.Field
                placeholder="SYMBOL"
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </Input>
          </Form.Control>
          <Form.Control isRequired>
            <Form.Label css={styles.text}>Token decimals</Form.Label>
            <Input size="md" css={styles.text}>
              <Input.Number
                placeholder="18"
                onChange={(e) => setTokenDecimals(e.target.value)}
              />
            </Input>
          </Form.Control>
          <Form.Control>
            <Form.Label css={styles.text}>Token image source</Form.Label>
            <Input size="md" css={styles.text}>
              <Input.Field
                placeholder="Token image source"
                onChange={(e) => setTokenImageSource(e.target.value)}
              />
            </Input>
          </Form.Control>
          <Button
            size="sm"
            isDisabled={!tokenDecimals.length || !tokenSymbol.length}
            onPress={() => {
              handlers.addAsset({
                asset: {
                  address: metadata.assetAddress,
                  image: tokenImageSource,
                  decimals: Number(tokenDecimals),
                  symbol: tokenSymbol,
                },
              });
              store.openManageAssetsDialog();
            }}
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
  text: cssObj({
    fontSize: '$sm',
  }),
};
