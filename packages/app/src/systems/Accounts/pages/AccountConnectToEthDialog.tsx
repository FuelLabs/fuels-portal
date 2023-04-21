import { Button, Dialog, Icon, IconButton, Stack } from '@fuel-ui/react';
import { useEffect } from 'react';

import { useAccountConnectionEth } from '../hooks';

import { buttonListItem } from '~/systems/Core';

export function AccountConnectToEthDialog() {
  const { connectors, handlers, isConnected } = useAccountConnectionEth();
  const { connect, closeDialog } = handlers;

  useEffect(() => {
    if (isConnected) {
      closeDialog();
    }
  }, [isConnected]);

  return (
    <>
      <Dialog.Heading>
        Connect to Ethereum
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description>
        <Stack gap="$2">
          {connectors?.map((connector) =>
            !connector.ready ||
            // TODO: remove this line after make WalletConnect work
            connector.name !== 'MetaMask' ? null : (
              <Button
                key={connector.id}
                onPress={() => connect({ connector })}
                variant="outlined"
                color="gray"
                css={buttonListItem}
              >
                {connector.name}
              </Button>
            )
          )}
        </Stack>
      </Dialog.Description>
    </>
  );
}
