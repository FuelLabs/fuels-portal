import { createStore } from '@fuels-portal/store';

import { bridgeMachine } from '../Bridge';
import { bridgeEvents } from '../Bridge/events';
import { ecosystemMachine } from '../Ecosystem';
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
  .addMachine(Services.ecosystem, () => ecosystemMachine)
  .addHandlers(overlayEvents)
  .addHandlers(bridgeEvents)
  .setup();

export const { StoreProvider } = store;
