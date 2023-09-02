import { createStore } from '@fuels-portal/store';
import {
  bridgeMachine,
  bridgeEvents,
  bridgeTxsMachine,
} from '~/systems/Bridge';
import { ethAssetListMachine, assetListEvents } from '~/systems/Chains';
import { ecosystemMachine } from '~/systems/Ecosystem';
import { overlayMachine, overlayEvents } from '~/systems/Overlay';

import { Services } from './types';
import type { StoreMachines } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.bridge, () => bridgeMachine)
  .addMachine(Services.bridgeTxs, () => bridgeTxsMachine)
  .addMachine(Services.ecosystem, () => ecosystemMachine)
  .addMachine(Services.ethAssetList, () => ethAssetListMachine)
  .addHandlers(overlayEvents)
  .addHandlers(bridgeEvents)
  .addHandlers(assetListEvents)
  .setup();

export const { StoreProvider } = store;
