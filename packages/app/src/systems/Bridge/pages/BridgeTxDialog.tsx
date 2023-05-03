import { Button, Dialog, Icon, IconButton } from '@fuel-ui/react';

import { BridgeSteps } from '../components';
import { useBridgeTx } from '../hooks';

import { useOverlay } from '~/systems/Overlay';

export function BridgeTxDialog() {
  const { metadata } = useOverlay<{ ethTxId: string }>();
  const { steps, handlers } = useBridgeTx({
    ethTxId: metadata.ethTxId,
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
