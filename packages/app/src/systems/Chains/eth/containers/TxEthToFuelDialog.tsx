import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { BridgeSteps } from '../../../Bridge/components';
import { useTxEthToFuel } from '../hooks';

import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, handlers } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading>
        Transaction
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.close}
        />
      </Dialog.Heading>
      <Dialog.Description>
        <BridgeSteps steps={steps} />
      </Dialog.Description>
      <Dialog.Footer>
        <Button>Test Button</Button>
      </Dialog.Footer>
    </>
  );
}
