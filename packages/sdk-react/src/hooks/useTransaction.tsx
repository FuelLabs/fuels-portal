/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
// should import BN because of this error: https://github.com/FuelLabs/fuels-ts/issues/1054
import type {
  TransactionScript,
  TransactionCreate,
  TransactionMint,
} from 'fuels';

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
    transaction: data || undefined,
    ...query,
  };
};
