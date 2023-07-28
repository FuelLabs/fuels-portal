import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog, Icon, Input, Text, Form } from '@fuel-ui/react';

import { useAddAssetForm, useAssets } from '../hooks';

import { store } from '~/store';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function AddAssetFormDialog() {
  const { metadata } = useOverlay<{ assetAddress: string }>();
  const { handlers } = useAssets();

  const form = useAddAssetForm();

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
                onChange={(e) => {
                  form.setValue('symbol', e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Input>
          </Form.Control>
          <Form.Control isRequired>
            <Form.Label css={styles.text}>Token decimals</Form.Label>
            <Input size="md" css={styles.text}>
              <Input.Number
                placeholder="18"
                onChange={() => {
                  form.register('decimals');
                }}
              />
            </Input>
          </Form.Control>
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          size="sm"
          intent="primary"
          isDisabled={
            form.getValues('decimals') === 0 || !form.getValues('symbol').length
          }
          onPress={() => {
            handlers.addAsset({
              asset: {
                address: metadata.assetAddress,
                image: '',
                decimals: form.getValues('decimals'),
                symbol: form.getValues('symbol'),
              },
            });
            store.openManageAssetsDialog();
          }}
          css={{ width: '$full' }}
        >
          Add token to list
        </Button>
      </Dialog.Footer>
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
