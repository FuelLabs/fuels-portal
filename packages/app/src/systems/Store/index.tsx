import { createStore } from '@fuels-portal/store';

import { overlayMachine } from '../Overlay';
import { overlayEvents } from '../Overlay/events';

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
