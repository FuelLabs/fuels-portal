import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useConnectFuel = () => {
  const fuel = useFuel();
  const mutation = useMutation(async () => {
    if (!fuel) {
      throw Error('Fuel instance not detected');
    }
    const isConnected = await fuel.connect();
    return isConnected;
  });

  return mutation;
};
