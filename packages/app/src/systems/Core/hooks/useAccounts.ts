import { useQuery } from '@tanstack/react-query';

import { useFuel } from './useFuel';
import { useIsFuelConnected } from './useIsFuelConnected';

export const useAccounts = () => {
  const fuel = useFuel();
  const isFuelConnected = useIsFuelConnected();

  return useQuery(
    ['fuelAccounts'],
    async () => {
      if (!fuel) {
        throw new Error('Fuel instance not detected');
      }
      const accounts = await fuel.accounts();
      return accounts;
    },
    {
      enabled: !!fuel && !isFuelConnected.isLoading && !!isFuelConnected.data,
    }
  );
};
