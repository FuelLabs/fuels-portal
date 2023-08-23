import { Services, type Store } from '~/store';
import type { BridgeAsset } from '~/systems/Bridge';

export function assetListEvents(store: Store) {
  return {
    addAsset(input: { asset: BridgeAsset }) {
      store.send(Services.ethAssetList, { type: 'ADD_ASSET', input });
    },
    removeAsset(input: { address?: string }) {
      console.log(`input`, input);
      store.send(Services.ethAssetList, { type: 'REMOVE_ASSET', input });
    },
  };
}
