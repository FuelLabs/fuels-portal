import { createStore } from '@fuels-portal/store';

import { overlayEvents, overlayMachine } from '../Overlay';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addHandlers(overlayEvents)
  .setup();

export const { StoreProvider } = store;
