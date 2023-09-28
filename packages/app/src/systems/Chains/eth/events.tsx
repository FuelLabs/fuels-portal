import type { PublicClient, WalletClient } from 'viem';
import { Services, type Store } from '~/store';
import type { BridgeAsset } from '~/systems/Bridge';

export function assetListEvents(store: Store) {
  return {
    addAsset(input: { asset: BridgeAsset }) {
      store.send(Services.ethAssetList, { type: 'ADD_ASSET', input });
    },
    removeAsset(input: { address?: string }) {
      store.send(Services.ethAssetList, { type: 'REMOVE_ASSET', input });
    },
    faucetErc20(input: {
      address?: string;
      walletClient?: WalletClient;
      publicClient?: PublicClient;
    }) {
      store.send(Services.ethAssetList, { type: 'FAUCET_ERC20', input });
    },
  };
}
