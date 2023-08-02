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
  Form,
  Input,
  IconButton,
} from '@fuel-ui/react';
import { NativeAssetId } from 'fuels';
import { useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { EthAssetCard } from '../components';
import { useManageEthAssets, useSetAddressForm } from '../hooks';
import type { SetAddressFormValues } from '../hooks';

import { store } from '~/store';
import { useBridge } from '~/systems/Bridge/hooks';
import { shortAddress } from '~/systems/Core';

export function EthAssetsDialog() {
  const { handlers: bridgeHandlers } = useBridge();
  const [editable, setEditable] = useState(false);

  const form = useSetAddressForm();

  const newAssetAddress = useWatch({ name: 'address', control: form.control });

  const {
    assets,
    handlers,
    showCustomTokenButton,
    showUseTokenButton,
    doesAssetExist,
    assetInfo,
  } = useManageEthAssets(newAssetAddress);

  const onSubmitCustomToken = (data: SetAddressFormValues) => {
    store.openAddAssetsDialog({
      assetAddress: data.address,
    });
  };

  return (
    <>
      <Dialog.Close />
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex gap="$4" justify="start" css={styles.dialogHeadingContainer}>
          {editable && (
            <IconButton
              aria-label="Set editable to false"
              variant="link"
              icon="ArrowLeft"
              onPress={() => setEditable(false)}
            />
          )}
          <Text color="intentsBase12" fontSize="sm">
            {!editable ? 'Select token' : 'Manage token list'}
          </Text>
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack css={{ pb: '$2' }}>
          <Controller
            name="address"
            control={form.control}
            render={(props) => {
              return (
                <Form.Control isInvalid={doesAssetExist}>
                  <Input size="md" css={styles.text}>
                    <Input.Field
                      {...props.field}
                      placeholder="Search or paste custom address"
                    />
                  </Input>
                  <Form.ErrorMessage>
                    {`Please enter a valid address. This address has already been added.
                    `}
                  </Form.ErrorMessage>
                </Form.Control>
              );
            }}
          />
        </Box.Stack>
        <CardList isClickable={!editable}>
          {/* TODO test that use token works */}
          <>
            {showUseTokenButton && (
              <EthAssetCard
                icon={
                  <Avatar.Generated
                    hash={
                      (assetInfo?.address || '') + (assetInfo?.symbol || '')
                    }
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
                  // store.openManageAssetsDialog();
                }}
              />
            )}
          </>
          <>
            {showCustomTokenButton && (
              <EthAssetCard
                icon={<Icon icon="HelpOctagon" />}
                name={shortAddress(form.getValues('address'))}
                onAdd={form.handleSubmit(onSubmitCustomToken)}
              />
            )}
          </>
          <>
            {!(showCustomTokenButton || showUseTokenButton) &&
              assets.map((asset, i) => (
                <EthAssetCard
                  key={`${asset.address || ''}${asset.symbol || ''}${String(
                    i
                  )}`}
                  icon={
                    asset.image ? (
                      <Image alt=" " src={asset.image} />
                    ) : (
                      <Avatar.Generated
                        size="xsm"
                        hash={asset.address || asset.symbol || String(i)}
                      />
                    )
                  }
                  name={asset.symbol || ''}
                  onPress={
                    !editable
                      ? () => {
                          bridgeHandlers.changeAssetAddress({
                            assetAddress: asset.address,
                          });
                        }
                      : undefined
                  }
                  onRemove={
                    editable
                      ? () => {
                          handlers.removeAsset({ address: asset.address });
                        }
                      : undefined
                  }
                  isRemoveDisabled={asset.address === NativeAssetId}
                  removeToolTip={
                    asset.address === NativeAssetId
                      ? 'ETH is a native asset.  It can not be remove'
                      : undefined
                  }
                />
              ))}
          </>
        </CardList>
      </Dialog.Description>
      <Dialog.Footer css={styles.dialogFooter}>
        {!editable && (
          <Button variant="ghost" onPress={() => setEditable(true)}>
            <Icon icon="Edit" />
            <Text color="intentsBase12">Manage token list</Text>
          </Button>
        )}
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
  dialogFooter: cssObj({
    borderTop: '1px solid $intentsBase8',
    justifyContent: 'center',
    paddingTop: '$4',
  }),
  text: cssObj({
    fontSize: '$sm',
  }),
};
