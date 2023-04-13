import { useQuery } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useIsFuelConnected = () => {
  const fuel = useFuel();

  return useQuery(
    ['isFuelConnected'],
    async () => {
      if (!fuel) {
        throw new Error('Fuel instance not detected');
      }
      const isFuelConnected = await fuel.isConnected();
      return isFuelConnected;
    },
    {
      enabled: !!fuel,
    }
  );
};
