import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useFuel } from './useFuel';

import { queryClient } from '~/providers';

const queryKey = 'isFuelConnected';

export const useIsFuelConnected = () => {
  const fuel = useFuel();

  const onConnectionChange = () => {
    console.log('invalidating: ', queryKey);
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    queryClient.invalidateQueries({ queryKey: ['fuelAccounts'] });
  };

  useEffect(() => {
    if (fuel) {
      fuel.on(fuel.events.connection, onConnectionChange);
    }
    return () => {
      if (fuel) {
        console.log('in connected return');
        fuel.off(fuel?.events.connection, onConnectionChange);
      }
    };
  }, [fuel]);

  return useQuery(
    [queryKey],
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
