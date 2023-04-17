import { useQuery } from '@tanstack/react-query';

import { useFuel } from './useFuel';
import { useIsFuelConnected } from './useIsFuelConnected';

export const useAccounts = () => {
  const fuel = useFuel();
  const isFuelConnected = useIsFuelConnected();

  console.log(`isFuelConnected.data`, isFuelConnected.data);

  return useQuery(
    ['fuelAccounts'],
    async () => {
      console.log('querying');
      if (!fuel) {
        throw new Error('Fuel instance not detected');
      }

      // if (isFuelConnected.isLoading || !isFuelConnected.data) {
      //   return [];
      // }

      const accounts = await fuel.accounts();
      return accounts;
    },
    {
      enabled:
        !!fuel &&
        !isFuelConnected.isLoading &&
        !!isFuelConnected.data &&
        !isFuelConnected.isError,
    }
  );
};
