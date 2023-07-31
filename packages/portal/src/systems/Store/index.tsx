import { createStore } from '@fuels-portal/store';

import type { StoreMachines } from './types';
import { Services } from './types';

import { ecosystemMachine } from '~/systems/Ecosystem';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.ecosystem, () => ecosystemMachine)
  .setup();

export const { StoreProvider } = store;
