import { createStore } from '@fuels-portal/store';

import { bridgeMachine } from '../Bridge';
import { bridgeEvents } from '../Bridge/events';
import { overlayMachine, overlayEvents } from '../Overlay';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.bridge, () => bridgeMachine)
  .addHandlers(overlayEvents)
  .addHandlers(bridgeEvents)
  .setup();

export const { StoreProvider } = store;
