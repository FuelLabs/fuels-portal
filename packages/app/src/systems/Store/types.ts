import type { StoreClass } from '@fuels-portal/store';

import type { BridgeMachine } from '../Bridge';
import type { EcosystemMachine } from '../Ecosystem';
import type { OverlayMachine } from '../Overlay';

export enum Services {
  overlay = 'overlay',
  bridge = 'bridge',
  ecosystem = 'ecosystem',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  bridge: BridgeMachine;
  ecosystem: EcosystemMachine;
};

export type Store = StoreClass<StoreMachines>;
