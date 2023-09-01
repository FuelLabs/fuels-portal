import type { BN } from 'fuels';
import type { WalletClient } from 'viem';

import type { FromToNetworks } from '../Chains';
import type { Store } from '../Store';
import { Services } from '../Store';

import type { BridgeTxsMachineContext } from './machines';
import type { BridgeInputs, PossibleBridgeInputs } from './services';

export function bridgeEvents(store: Store) {
  return {
    changeNetworks(input: FromToNetworks) {
      store.send(Services.bridge, { type: 'CHANGE_NETWORKS', input });
    },
    changeAssetAddress(input: { assetAddress?: string }) {
      store.send(Services.bridge, { type: 'CHANGE_ASSET_ADDRESS', input });
    },
    startBridging(input: PossibleBridgeInputs) {
      store.send(Services.bridge, { type: 'START_BRIDGING', input });
    },
    changeAssetAmount(input: { assetAmount?: BN }) {
      store.send(Services.bridge, { type: 'CHANGE_ASSET_AMOUNT', input });
    },
    fetchTxs(input?: BridgeInputs['fetchTxs']) {
      if (!input) return;

      store.send(Services.bridgeTxs, { type: 'FETCH', input });
    },
    relayTxFuelToEth({
      input,
      fuelTxId,
    }: {
      input?: { ethWalletClient: WalletClient };
      fuelTxId: string;
    }) {
      if (!input) return;

      // TODO: make store.send function support this last object prop
      const service = store.services[Services.bridgeTxs];
      service.send(
        { type: 'RELAY_TO_ETH', input },
        {
          to: (context: BridgeTxsMachineContext) =>
            context.fuelToEthTxRefs?.[fuelTxId],
        }
      );
    },
  };
}
