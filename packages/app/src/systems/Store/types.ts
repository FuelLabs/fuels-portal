import type { StoreClass } from '@fuels-portal/store';

import type { AssetListMachine } from '../Chains';

import type { BridgeMachine } from '~/systems/Bridge';
import type { EcosystemMachine } from '~/systems/Ecosystem';
import type { OverlayMachine } from '~/systems/Overlay';

export enum Services {
  overlay = 'overlay',
  bridge = 'bridge',
  ecosystem = 'ecosystem',
  assetList = 'assetList',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  bridge: BridgeMachine;
  ecosystem: EcosystemMachine;
  assetList: AssetListMachine;
};

export type Store = StoreClass<StoreMachines>;
