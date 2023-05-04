import { useEffect, useState } from 'react';

import { useFuel } from './useFuel';

export const useAccount = () => {
  const [address, setAddress] = useState<string>();
  const fuel = useFuel();

  useEffect(() => {
    async function getCurrentAccount() {
      try {
        const currentFuelAccount = await fuel?.currentAccount();
        setAddress(currentFuelAccount);
      } catch (error: unknown) {
        setAddress(undefined);
      }
    }

    if (fuel) {
      getCurrentAccount();
    }

    fuel?.on(fuel?.events.currentAccount, getCurrentAccount);
    fuel?.on(fuel?.events.connection, getCurrentAccount);
    fuel?.on(fuel?.events.accounts, getCurrentAccount);

    return () => {
      fuel?.off(fuel?.events.currentAccount, getCurrentAccount);
      fuel?.off(fuel?.events.connection, getCurrentAccount);
      fuel?.off(fuel?.events.accounts, getCurrentAccount);
    };
  }, [fuel]);

  return {
    address,
    isConnected: !!address,
  };
};
