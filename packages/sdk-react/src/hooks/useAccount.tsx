import { useQuery } from '@tanstack/react-query';

import { ACCOUNT_KEY, useFuel } from '../components';

export const useAccount = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [ACCOUNT_KEY],
    async () => {
      try {
        const currentFuelAccount = await fuel?.currentAccount();
        return currentFuelAccount || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    account: data || undefined,
    ...queryProps,
  };
};
