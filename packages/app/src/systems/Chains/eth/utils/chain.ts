import type { SupportedChain } from '../../types';

export const ETH_UNITS = 18;

export const isEthChain = (chain: SupportedChain | undefined | null) => {
  return chain?.network === 'goerli' || chain?.network === 'foundry';
};
