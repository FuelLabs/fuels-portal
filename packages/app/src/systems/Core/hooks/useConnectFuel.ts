import { useMutation } from '@tanstack/react-query';
import { useFuel } from './useFuel';

export const useConnectFuel = () => {
  const fuel = useFuel();
  const mutation = useMutation(async () => {
    await fuel?.connect();
  });
  return mutation;
};
