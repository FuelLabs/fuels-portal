import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { fuelQueryClient } from '../components';

import { useFuel } from './useFuel';

const accountQueryKey = 'account';

export const useAccount = () => {
  const fuel = useFuel();

  useEffect(() => {
    async function fetchAccountQuery() {
      await fuelQueryClient.invalidateQueries([accountQueryKey]);
    }

    fuel?.on(fuel?.events.currentAccount, fetchAccountQuery);
    fuel?.on(fuel?.events.connection, fetchAccountQuery);
    fuel?.on(fuel?.events.accounts, fetchAccountQuery);

    return () => {
      fuel?.off(fuel?.events.currentAccount, fetchAccountQuery);
      fuel?.off(fuel?.events.connection, fetchAccountQuery);
      fuel?.off(fuel?.events.accounts, fetchAccountQuery);
    };
  }, [fuel]);

  const { isLoading, isError, isSuccess, data, error } = useQuery(
    [accountQueryKey],
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
