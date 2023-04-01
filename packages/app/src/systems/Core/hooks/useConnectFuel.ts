import { useMutation } from '@tanstack/react-query';
import { useFuel } from './useFuel';

export const useConnectFuel = () => {
  const fuel = useFuel();
  const mutation = useMutation(async () => {
    if (!fuel) {
      throw Error('Fuel instance not detected');
    }
    await fuel.connect();
  });
  return mutation;
};
