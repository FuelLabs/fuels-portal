import { Dialog } from '@fuel-ui/react';

import { useTxEthToFuel } from '../hooks';

import { BridgeSteps } from '~/systems/Bridge';
import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Close />
      <Dialog.Heading>Transaction</Dialog.Heading>
      <Dialog.Description>
        <BridgeSteps steps={steps} />
      </Dialog.Description>
    </>
  );
}
