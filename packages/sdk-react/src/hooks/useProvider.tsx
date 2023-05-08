import { useQuery } from '@tanstack/react-query';

import { PROVIDER_KEY, useFuelReactContext } from '../components';

export const useProvider = () => {
  const { fuel } = useFuelReactContext();

  const { data, ...queryProps } = useQuery([PROVIDER_KEY], async () => {
    const provider = await fuel?.getProvider();
    return provider;
  });

  return {
    data: data || undefined,
    ...queryProps,
  };
};
