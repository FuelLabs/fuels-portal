import type { SupportedChain } from '../../types';

export const isFuelChain = (chain: SupportedChain | undefined | null) => {
  return !!chain?.name.startsWith('Fuel');
};
