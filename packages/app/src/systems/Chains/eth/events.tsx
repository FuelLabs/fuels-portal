import type { Asset } from './machines';

import { Services, type Store } from '~/store';

export function assetListEvents(store: Store) {
  return {
    addAsset(input: { asset: Asset }) {
      store.send(Services.assetList, { type: 'ADD_ASSET', input });
    },
    removeAsset(input: { asset: Asset }) {
      store.send(Services.assetList, { type: 'REMOVE_ASSET', input });
    },
  };
}
