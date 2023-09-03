import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../components';

export const useConnect = () => {
  const { fuel } = useFuel();

  const { mutate, ...mutateProps } = useMutation({
    mutationFn: async (connectorName?: string) => {
      if (connectorName) {
        localStorage.setItem('connector', connectorName);
        await fuel?.selectConnector(connectorName);
      }
      return fuel?.connect();
    },
  });

  return {
    connect: mutate,
    ...mutateProps,
  };
};
