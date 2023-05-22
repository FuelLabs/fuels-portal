import { useQuery } from '@tanstack/react-query';

import { PROVIDER_KEY, useFuel } from '../components';

export const useProvider = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [PROVIDER_KEY],
    async () => {
      const provider = await fuel?.getProvider();
      return provider || null;
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    provider: data || undefined,
    ...queryProps,
  };
};
