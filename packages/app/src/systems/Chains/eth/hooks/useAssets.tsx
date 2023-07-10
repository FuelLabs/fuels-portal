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
  // return {
  //   assets: [
  //     {
  //       decimals: ETH_UNITS,
  //       symbol: 'ETH',
  //       image: ethLogoSrc,
  //     },
  //     {
  //       address: VITE_ETH_ERC20_TOKEN_ADDRESS as `0x${string}`,
  //       decimals: ETH_UNITS,
  //       symbol: 'TKN',
  //       // image: ethLogoSrc,
  //     },
  //   ],
  // };
};
