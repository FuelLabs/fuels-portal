import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useDisconnectFuel = () => {
  const fuel = useFuel();
  const mutation = useMutation(async () => {
    if (!fuel) {
      throw Error('Fuel instance not detected');
    }
    const isConnected = await fuel.disconnect();
    return isConnected;
  });

  return mutation;
};
