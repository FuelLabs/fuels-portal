import { createStore } from '@fuels-portal/store';

import { overlayMachine } from '../Overlay';
import { overlayEvents } from '../Overlay/events';
import { themeEvents } from '../Settings';
import { themeMachine } from '../Settings/machines/themeMachine';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
  persistedStates: [Services.theme],
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.theme, () => themeMachine)
  .addHandlers(overlayEvents)
  .addHandlers(themeEvents)
  .setup();

export const { StoreProvider } = store;
