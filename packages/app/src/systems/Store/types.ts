import type { StoreClass } from '@fuels-portal/store';

import type { FuelAccountMachine } from '../Accounts';
import type { OverlayMachine } from '../Overlay';
import type { ThemeMachine } from '../Settings/machines/themeMachine';

export enum Services {
  overlay = 'overlay',
  theme = 'theme',
  fuelAccount = 'fuelAccount',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  theme: ThemeMachine;
  fuelAccount: FuelAccountMachine;
};

export type Store = StoreClass<StoreMachines>;
