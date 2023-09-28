import type { PublicClient, WalletClient } from 'viem';
import { Services, store } from '~/store';

import type { EthAssetListMachineState } from '../machines';

const selectors = {
  assetList: (query?: string) => (state: EthAssetListMachineState) => {
    if (query) {
      const queriedAssets = state.context.assetList?.filter(
        (asset) =>
          asset.address?.toLowerCase().startsWith(query.toLowerCase()) ||
          asset.symbol?.toLowerCase().startsWith(query.toLowerCase())
      );

      return queriedAssets;
    }

    return state.context.assetList;
  },
  isLoading: (state: EthAssetListMachineState) => {
    return state.hasTag('loading');
  },
  isLoadingFaucet: (state: EthAssetListMachineState) => {
    return state.hasTag('loadingFaucet');
  },
};

type UseAssetParams = {
  assetQuery: string;
};

export const useAssets = (params?: UseAssetParams) => {
  const { assetQuery } = params || {};
  const assetList = store.useSelector(
    Services.ethAssetList,
    selectors.assetList()
  );
  const filteredAssetList = store.useSelector(
    Services.ethAssetList,
    selectors.assetList(assetQuery)
  );
  const isLoading = store.useSelector(
    Services.ethAssetList,
    selectors.isLoading
  );
  const isLoadingFaucet = store.useSelector(
    Services.ethAssetList,
    selectors.isLoadingFaucet
  );
  function faucetErc20({
    address,
    walletClient,
    publicClient,
  }: {
    address?: string;
    walletClient?: WalletClient;
    publicClient?: PublicClient;
  }) {
    store.faucetErc20({ address, walletClient, publicClient });
  }

  const isSearchResultsEmpty =
    !!assetList?.length &&
    !filteredAssetList?.length &&
    assetQuery &&
    !isLoading;
  const showAssetList = assetList?.length && !isLoading;

  return {
    assets: filteredAssetList || [],
    handlers: {
      addAsset: store.addAsset,
      removeAsset: store.removeAsset,
      faucetErc20,
    },
    isLoading,
    isLoadingFaucet,
    isSearchResultsEmpty,
    showAssetList,
  };
};
