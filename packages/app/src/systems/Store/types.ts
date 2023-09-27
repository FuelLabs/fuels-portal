import type { StoreClass } from '@fuels/react-xstore';
import type { BridgeMachine, BridgeTxsMachine } from '~/systems/Bridge';
import type { EcosystemMachine } from '~/systems/Ecosystem';
import type { OverlayMachine } from '~/systems/Overlay';

import type { EthAssetListMachine } from '../Chains';

export enum Services {
  overlay = 'overlay',
  bridge = 'bridge',
  bridgeTxs = 'bridgeTxs',
  ecosystem = 'ecosystem',
  ethAssetList = 'ethAssetList',
}

export type StoreMachines = {
  overlay: OverlayMachine;
  bridge: BridgeMachine;
  bridgeTxs: BridgeTxsMachine;
  ecosystem: EcosystemMachine;
  ethAssetList: EthAssetListMachine;
};

export type Store = StoreClass<StoreMachines>;
