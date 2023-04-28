import type { StoreClass } from '@fuels-portal/store';

import type { BridgeMachine } from '../Bridge';
import type { OverlayMachine } from '../Overlay';
import type { ThemeMachine } from '../Settings';

export enum Services {
  overlay = 'overlay',
  theme = 'theme',
  bridge = 'bridge',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  theme: ThemeMachine;
  bridge: BridgeMachine;
};

export type Store = StoreClass<StoreMachines>;
