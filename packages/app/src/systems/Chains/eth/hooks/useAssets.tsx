import type { PublicClient, WalletClient } from 'viem';
import { Services, store } from '~/store';

import type { EthAssetListMachineState } from '../machines';

const selectors = {
  assetList: (state: EthAssetListMachineState) => state.context.assetList || [],
  isLoading: (state: EthAssetListMachineState) => {
    return state.hasTag('loading');
  },
  isLoadingFaucet: (state: EthAssetListMachineState) => {
    return state.hasTag('loadingFaucet');
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

  return {
    assets: assetList || [],
    handlers: {
      addAsset: store.addAsset,
      removeAsset: store.removeAsset,
      faucetErc20,
    },
    isLoading,
    isLoadingFaucet,
  };
};
