import { ETH_CHAIN, FUEL_CHAIN } from '~/config';

export type SupportedChain = typeof ETH_CHAIN | typeof FUEL_CHAIN;
export type FromToNetworks = {
  fromNetwork: SupportedChain;
  toNetwork: SupportedChain;
};

type ChainUrlParams = 'eth' | 'fuel' | string | undefined | null;
export const getChainFromUrlParam = (param: ChainUrlParams) => {
  if (param === 'eth') return ETH_CHAIN;
  if (param === 'fuel') return FUEL_CHAIN;

  return undefined;
};

export const isFuelChain = (chain: SupportedChain | undefined | null) => {
  return !!chain?.name.startsWith('Fuel');
};

export const isEthChain = (chain: SupportedChain | undefined | null) => {
  return chain?.network === 'goerli' || chain?.network === 'foundry';
};
