import type { EthAssetListMachineState } from '../machines';

import { Services, store } from '~/store';

export const useAssets = () => {
  const assetList = store.useSelector(
    Services.ethAssetList,
    (state: EthAssetListMachineState) => state.context?.assetList
  );

  return {
    assets: assetList || [],
    handlers: {
      addAsset: store.addAsset,
      removeAsset: store.removeAsset,
    },
  };
};
