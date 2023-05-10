import { useQuery } from '@tanstack/react-query';

import { IS_CONNECTED_KEY, useFuel } from '../components';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [IS_CONNECTED_KEY],
    async () => {
      const isConnected = await fuel?.isConnected();
      return isConnected || false;
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    isConnected: data,
    ...queryProps,
  };
};
