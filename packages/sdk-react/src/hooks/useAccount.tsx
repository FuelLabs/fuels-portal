import { useQuery } from '@tanstack/react-query';

import { ACCOUNT_QUERY_KEY, useFuelReactContext } from '../components';

export const useAccount = () => {
  const { fuel } = useFuelReactContext();

  const { isLoading, isError, isSuccess, data, error } = useQuery(
    [ACCOUNT_QUERY_KEY],
    async () => {
      if (!fuel) {
        return null;
      }
      try {
        const currentFuelAccount = await fuel.currentAccount();
        return currentFuelAccount;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    address: data,
    isConnected: !!data,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
  };
};
