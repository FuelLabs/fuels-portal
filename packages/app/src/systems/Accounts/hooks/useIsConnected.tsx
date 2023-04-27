import { useEffect, useState } from 'react';

import { useFuel } from './useFuel';

export const useIsConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>();
  const fuel = useFuel();

  useEffect(() => {
    async function handleConnection() {
      const isFuelConnected = await fuel?.isConnected();
      setIsConnected(isFuelConnected);
    }

    if (fuel) {
      handleConnection();
    }

    fuel?.on(fuel.events.connection, handleConnection);

    return () => {
      fuel?.off(fuel.events.connection, handleConnection);
    };
  }, [fuel]);

  return isConnected;
};
