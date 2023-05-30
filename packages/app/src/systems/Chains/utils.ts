import { isEthChain } from './eth';
import { isFuelChain } from './fuel';
import type { SupportedChain } from './types';

export const getChainName = (network?: SupportedChain) => {
  if (isEthChain(network)) {
    return 'Ethereum';
  }

  if (isFuelChain(network)) {
    return 'Fuel';
  }

  return '';
};

export const calculateBlockAge = (timestamp?: number) => {
  if (!timestamp) {
    return 'pending';
  }
  const currentDate = new Date();
  const blockDate = new Date(timestamp * 1000);
  const diffInTime = currentDate.getTime() - blockDate.getTime();
  const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
  return `${diffInDays} days ago`;
};
