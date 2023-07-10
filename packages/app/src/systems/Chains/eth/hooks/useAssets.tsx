import type { AssetListMachineState } from '../machines';

import { Services, store } from '~/store';

export const useAssets = () => {
  const assetList = store.useSelector(
    Services.assetList,
    (state: AssetListMachineState) => state.context?.assetList
  );

  return {
    assets: assetList || [],
    addAsset: store.addAsset,
    removeAsset: store.removeAsset,
  };
};
