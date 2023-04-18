import type { StoreClass } from '@fuels-portal/store';

import type { OverlayMachine } from '../Overlay';

export enum Services {
  overlay = 'overlay',
}

export type StoreMachines = {
  overlay: OverlayMachine;
};

export type Store = StoreClass<StoreMachines>;
