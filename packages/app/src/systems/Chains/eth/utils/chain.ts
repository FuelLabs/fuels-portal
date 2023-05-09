import type { SupportedChain } from '../../types';

export const isEthChain = (chain: SupportedChain | undefined | null) => {
  return chain?.network === 'goerli' || chain?.network === 'foundry';
};
