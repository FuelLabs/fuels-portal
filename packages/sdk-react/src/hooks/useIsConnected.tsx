import { useQuery } from '@tanstack/react-query';

import { IS_CONNECTED_KEY, useFuelReactContext } from '../components';

export const useIsConnected = () => {
  const { fuel } = useFuelReactContext();

  const { data, ...queryProps } = useQuery([IS_CONNECTED_KEY], async () => {
    const isConnected = await fuel?.isConnected();
    return isConnected;
  });

  return {
    data: data || undefined,
    ...queryProps,
  };
};
