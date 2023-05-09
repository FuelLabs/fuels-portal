import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useDisconnect = () => {
  const fuel = useFuel();

  const { data, mutate, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.disconnect();
    },
  });

  // TODO: wrap in useCallback if we add more functionality/args
  // to the mutationFn
  const disconnect = mutate;

  // TODO: implement a connectAsync

  return {
    handlers: {
      disconnect,
    },
    data,
    ...mutateProps,
  };
};
