import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useDisconnect = () => {
  const fuel = useFuel();

  const { data, mutate, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.disconnect();
    },
  });

  return {
    handlers: {
      disconnect: mutate,
    },
    data,
    ...mutateProps,
  };
};
