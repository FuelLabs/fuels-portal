import { Provider } from '@ethersproject/providers';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const useNonFuelProvider = () => {
  const account = useAccount();
  return useQuery(
    ['nonFuelProvider'],
    async () => {
      const provider = await account.connector?.getProvider();
      return provider as Provider;
    },
    {
      enabled:
        Boolean(account) &&
        Boolean(account.connector) &&
        Boolean(account.isConnected),
    }
  );
};
