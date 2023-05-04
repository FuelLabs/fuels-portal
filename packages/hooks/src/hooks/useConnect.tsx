import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useConnect = () => {
  const fuel = useFuel();

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    mutate,
    reset,
    status,
  } = useMutation({
    mutationFn: async () => {
      return fuel?.connect();
    },
  });

  // TODO: wrap in useCallback if we add more functionality/args
  // to the mutationFn
  const connect = mutate;

  // TODO: implement a connectAsync

  return {
    connect,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    failureCount,
    failureReason,
    reset,
    status,
  };
};
