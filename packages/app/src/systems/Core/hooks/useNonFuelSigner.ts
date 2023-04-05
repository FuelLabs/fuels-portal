import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

export const useNonFuelSigner = () => {
  const account = useAccount();
  const nonFuelSigner = new ethers.providers.JsonRpcProvider(
    process.env.VITE_NON_FUEL_PROVIDER_URL!
  ).getSigner(account.address);
  return nonFuelSigner;
};
