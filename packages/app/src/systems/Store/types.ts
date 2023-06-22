import type { StoreClass } from '@fuels-portal/store';

import type { BridgeMachine } from '~/systems/Bridge';
import type { EcosystemMachine } from '~/systems/Ecosystem';
import type { OverlayMachine } from '~/systems/Overlay';

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
