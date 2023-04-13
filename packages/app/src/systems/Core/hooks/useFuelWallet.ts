import { useQuery } from '@tanstack/react-query';

import { useFuel } from './useFuel';
import { useIsFuelConnected } from './useIsFuelConnected';

export const useFuelWallet = () => {
  const fuel = useFuel();
  const isFuelConnected = useIsFuelConnected();

  return useQuery(
    ['fuelWallet'],
    async () => {
      if (!isFuelConnected.data || isFuelConnected.isError) {
        return false;
      }
      if (!fuel) {
        throw new Error('Fuel instance not detected');
      }
      // The wallet should be connected as the user did it in the first step
      // We could add a check to see if the wallet is past the welcome steps
      // and still disconnected
      const currentAccount = await fuel.currentAccount();
      const currentWallet = (await fuel.getWallet(currentAccount))!;
      return currentWallet;
    },
    {
      enabled: !!fuel && !isFuelConnected.isLoading,
    }
  );
};
