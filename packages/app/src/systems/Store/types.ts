import type { StoreClass } from '@fuels-portal/store';

import type { BridgeMachine } from '~/systems/Bridge';
import type { OverlayMachine } from '~/systems/Overlay';

export enum Services {
  overlay = 'overlay',
  bridge = 'bridge',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  bridge: BridgeMachine;
};

export type Store = StoreClass<StoreMachines>;
