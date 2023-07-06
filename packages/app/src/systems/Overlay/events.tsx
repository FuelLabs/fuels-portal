import type { Store } from '../Store';
import { Services } from '../Store';

import type { OverlayData } from './machines/overlayMachine';

export function overlayEvents(store: Store) {
  return {
    openOverlay(input: OverlayData) {
      store.send(Services.overlay, { type: 'OPEN', input });
    },
    closeOverlay() {
      store.send(Services.overlay, { type: 'CLOSE' });
    },
    openTxEthToFuel({ txId }: { txId?: string }) {
      if (txId) {
        store.send(Services.overlay, {
          type: 'OPEN',
          input: {
            modal: 'tx.fromEth.toFuel',
            params: {
              txId,
            },
          },
        });
      }
    },
    openTxFuelToEth({ txId }: { txId: string }) {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'tx.fromFuel.toEth',
          params: {
            txId,
          },
        },
      });
    },
    openFuelInstall() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'fuel.install',
        },
      });
    },
    openEthAssetsDialog() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'eth.assets',
        },
      });
    },
    openManageAssetsDialog() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'eth.manage.assets',
        },
      });
    },
  };
}
