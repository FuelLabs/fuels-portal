import { useQuery } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useIsConnected = () => {
  const fuel = useFuel();

  return useQuery(
    ['connected'],
    async () => {
      const isFuelConnected = await fuel!.isConnected();
      return isFuelConnected;
    },
    {
      enabled: !!fuel,
    }
  );
};
