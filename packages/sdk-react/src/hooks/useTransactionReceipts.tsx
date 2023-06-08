import { useQuery } from '@tanstack/react-query';
import { TransactionResponse } from 'fuels';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useTransactionReceipts = ({ id }: { id?: string }) => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.transactionReceipts, id],
    async () => {
      try {
        const provider = await fuel?.getProvider();
        if (!provider) return null;

        const response = new TransactionResponse(id || '', provider);
        if (!response) return null;

        const { receipts } = await response.waitForResult();
        return receipts || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel && !!id,
    }
  );

  return {
    transactionReceipts: data || undefined,
    ...queryProps,
  };
};
