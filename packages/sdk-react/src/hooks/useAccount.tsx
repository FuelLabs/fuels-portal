import { useQuery } from '@tanstack/react-query';

import { ACCOUNT_KEY, useFuelReactContext } from '../components';

export const useAccount = () => {
  const { fuel } = useFuelReactContext();

  const { data, ...queryProps } = useQuery(
    [ACCOUNT_KEY],
    async () => {
      if (!fuel) {
        return null;
      }
      try {
        const currentFuelAccount = await fuel.currentAccount();
        return currentFuelAccount;
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
