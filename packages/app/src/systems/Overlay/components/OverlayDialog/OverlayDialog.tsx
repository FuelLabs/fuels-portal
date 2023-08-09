import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import {
  EthAssetsDialog,
  FuelInstallDialog,
  TxEthToFuelDialog,
  TxFuelToEthDialog,
} from '~/systems/Chains';
import { useOverlay } from '~/systems/Overlay';

const OVERLAY_HEIGHT = 100;
const OVERLAY_WIDTH = 400;

export function OverlayDialog() {
  const overlay = useOverlay();

  return (
    <Dialog
      isOpen={overlay.isDialogOpen}
      onOpenChange={(isOpen) => !isOpen && overlay.close()}
      css={styles.dialog}
    >
      <Dialog.Content css={styles.content}>
        {overlay.is('tx.fromEth.toFuel') && <TxEthToFuelDialog />}
        {overlay.is('tx.fromFuel.toEth') && <TxFuelToEthDialog />}
        {overlay.is('fuel.install') && <FuelInstallDialog />}
        {overlay.is('eth.assets') && <EthAssetsDialog />}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  dialog: cssObj({
    backdropFilter: 'blur(10px)',
  }),
  content: cssObj({
    width: OVERLAY_WIDTH,
    minHeight: OVERLAY_HEIGHT,
    maxWidth: OVERLAY_WIDTH,
    maxHeight: 'none',
  }),
};
