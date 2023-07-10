import { Services, type Store } from '~/store';
import type { BridgeAsset } from '~/systems/Bridge';

export function assetListEvents(store: Store) {
  return {
    addAsset(input: { asset: BridgeAsset }) {
      store.send(Services.assetList, { type: 'ADD_ASSET', input });
    },
    removeAsset(input: { address: string }) {
      store.send(Services.assetList, { type: 'REMOVE_ASSET', input });
    },
  };
}
