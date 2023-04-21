import type { StoreClass } from '@fuels-portal/store';

import type { OverlayMachine } from '../Overlay';
import type { ThemeMachine } from '../Settings/machines/themeMachine';

export enum Services {
  overlay = 'overlay',
  theme = 'theme',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  theme: ThemeMachine;
};

export type Store = StoreClass<StoreMachines>;
