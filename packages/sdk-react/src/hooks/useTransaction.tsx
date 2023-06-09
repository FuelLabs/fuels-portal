import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';

export const useTransaction = (txId?: string) => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    ['transaction', txId],
    async () => {
      try {
        const provider = await fuel?.getProvider();
        if (!provider) return null;
        const response = await provider.getTransaction(txId || '');
        return response;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel && !!txId,
    }
  );

  return {
    txResponse: data || undefined,
    ...query,
  };
};
