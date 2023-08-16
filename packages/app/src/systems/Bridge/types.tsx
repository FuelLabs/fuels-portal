import type { SupportedChain } from '../Chains';

export type BridgeTx = {
  asset: {
    address?: string;
    amount: string;
  };
  date?: Date;
  txHash: string;
  fromNetwork: SupportedChain;
  toNetwork: SupportedChain;
  isDone: boolean;
};

export type BridgeAsset = {
  address?: string;
  decimals?: number;
  symbol?: string;
  image?: string;
  amount?: string;
};
