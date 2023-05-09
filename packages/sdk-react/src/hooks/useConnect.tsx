import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useConnect = () => {
  const fuel = useFuel();

  const { data, mutate, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.connect();
    },
  });

  return {
    data,
    handlers: {
      connect: mutate,
    },
    ...mutateProps,
  };
};
