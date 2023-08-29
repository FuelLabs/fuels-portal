import type { EthAssetListMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  assetList: (state: EthAssetListMachineState) => state.context.assetList || [],
  isLoading: (state: EthAssetListMachineState) => {
    return state.hasTag('loading');
  },
};

export const useAssets = () => {
  const assetList = store.useSelector(
    Services.ethAssetList,
    selectors.assetList
  );
  const isLoading = store.useSelector(
    Services.ethAssetList,
    selectors.isLoading
  );

  return {
    assets: assetList || [],
    handlers: {
      addAsset: store.addAsset,
      removeAsset: store.removeAsset,
    },
    isLoading,
  };
};
