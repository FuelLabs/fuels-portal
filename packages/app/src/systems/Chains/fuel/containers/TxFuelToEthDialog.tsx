import { Dialog } from '@fuel-ui/react';

import { useTxFuelToEth } from '../hooks';

import { BridgeSteps } from '~/systems/Bridge';
import { useOverlay } from '~/systems/Overlay';

export function TxFuelToEthDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps } = useTxFuelToEth({
    txId: metadata.txId,
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
