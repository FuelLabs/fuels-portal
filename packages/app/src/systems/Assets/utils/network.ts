import type { Ethereum, Fuel } from '@fuels/assets';

import type { Asset } from '../services';

type Network = Ethereum | Fuel; // Assuming Ethereum and Fuel are your types
export type NetworkTypes = Ethereum['type'] | Fuel['type'];
type NetworkTypeToNetwork<T> = T extends 'ethereum'
  ? Ethereum
  : T extends 'fuel'
  ? Fuel
  : Network;

export type GetAssetNetworkParams<T extends NetworkTypes | undefined> = {
  asset: Asset;
  chainId: number;
  networkType?: T;
};

export const getAssetNetwork = <T extends NetworkTypes | undefined>({
  asset,
  chainId,
  networkType,
}: GetAssetNetworkParams<T>): NetworkTypeToNetwork<T> => {
  const network = asset.networks.find(
    (network) => network.chainId === chainId && network.type === networkType
  ) as NetworkTypeToNetwork<T>;

  return network;
};
