import type { SupportedChain } from '../Chains';

export type BridgeTx = {
  date?: Date;
  txHash: string;
  fromNetwork: SupportedChain;
  toNetwork: SupportedChain;
};

export type BridgeAsset = {
  address?: string;
  decimals?: number;
  symbol?: string;
  image?: string;
};
