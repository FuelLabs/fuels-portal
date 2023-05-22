import type { StoreClass } from '@fuels-portal/store';

import type { BridgeMachine } from '../Bridge';
import type { OverlayMachine } from '../Overlay';

export enum Services {
  overlay = 'overlay',
  bridge = 'bridge',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  bridge: BridgeMachine;
};

export type Store = StoreClass<StoreMachines>;
