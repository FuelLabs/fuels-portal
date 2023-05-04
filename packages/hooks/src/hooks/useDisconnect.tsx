import { useMutation } from '@tanstack/react-query';

import { useFuel } from './useFuel';

export const useDisconnect = () => {
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
      return fuel?.disconnect();
    },
  });

  // TODO: wrap in useCallback if we add more functionality/args
  // to the mutationFn
  const disconnect = mutate;

  // TODO: implement a connectAsync

  return {
    disconnect,
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
