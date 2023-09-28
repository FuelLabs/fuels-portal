import { cssObj } from '@fuel-ui/css';
import {
  Box,
  CardList,
  Dialog,
  Text,
  Form,
  Input,
  IconButton,
  Spinner,
} from '@fuel-ui/react';
import { useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { VITE_ETH_ERC20 } from '~/config';
import { useBridge } from '~/systems/Bridge/hooks';

import { EthAssetCard } from '../components';
import { useAssets, useFaucetErc20, useSetAddressForm } from '../hooks';

export function EthAssetsDialog() {
  const { handlers: bridgeHandlers } = useBridge();
  const [editable, setEditable] = useState(false);

  const form = useSetAddressForm();

  const assetQuery = useWatch({ name: 'address', control: form.control });

  const {
    assets,
    handlers,
    isLoading,
    isLoadingFaucet,
    isSearchResultsEmpty,
    showAssetList,
  } = useAssets({ assetQuery });
  const {
    handlers: { faucetErc20 },
  } = useFaucetErc20();

  return (
    <>
      <Dialog.Close />
      <Dialog.Heading>
        <Box.Flex gap="$4" justify="start">
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
        <Box.Flex align="center" css={styles.controllerWrapper}>
          <Controller
            name="address"
            control={form.control}
            render={(props) => {
              return (
                <Form.Control css={{ width: '$full' }}>
                  <Input size="md" css={styles.headerInput}>
                    <Input.Field
                      {...props.field}
                      placeholder="Search or paste custom address"
                    />
                    {isLoading && (
                      <Input.ElementRight>
                        <Spinner />
                      </Input.ElementRight>
                    )}
                  </Input>
                  {!!isSearchResultsEmpty && (
                    <Form.HelperText>{`No asset found for your search "${assetQuery}"`}</Form.HelperText>
                  )}
                </Form.Control>
              );
            }}
          />
        </Box.Flex>
        <CardList isClickable={!editable}>
          {showAssetList &&
            assets.map((asset, i) => {
              const isEth = asset.address === undefined;
              const isFaucetable = asset.address === VITE_ETH_ERC20;

              return (
                <EthAssetCard
                  key={`${asset.address || ''}${asset.symbol || ''}${String(
                    i
                  )}`}
                  imageSrc={asset.image}
                  hash={asset.address}
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
                  onFaucet={
                    isFaucetable && faucetErc20
                      ? () => {
                          faucetErc20({
                            address: asset.address,
                          });
                        }
                      : undefined
                  }
                  isFaucetLoading={isFaucetable && isLoadingFaucet}
                  isRemoveDisabled={isEth}
                  removeToolTip={
                    isEth
                      ? 'ETH is a native asset.  It can not be removed'
                      : undefined
                  }
                />
              );
            })}
        </CardList>
      </Dialog.Description>
      {/*
      Keeping this comment here as we may need this component / design later when refactoring assets package
      {!editable && (
        <Dialog.Footer css={styles.dialogFooter}>
          <Button variant="link" onPress={() => setEditable(true)}>
            <Icon icon="Edit" />
            <Text color="intentsBase10">Manage token list</Text>
          </Button>
        </Dialog.Footer>
      )} */}
    </>
  );
}

const styles = {
  actionButton: cssObj({
    width: '100%',
  }),
  controllerWrapper: cssObj({
    pb: '$2',
  }),
  dialogFooter: cssObj({
    borderTop: '1px solid $border',
    justifyContent: 'center',
    paddingTop: '$2',
  }),
  headerInput: cssObj({
    fontSize: '$sm',
  }),
};
