import type { Fuel } from '@fuel-wallet/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useContext, createContext, useEffect } from 'react';

import { useFuel } from '../hooks';

export const fuelQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // onError: handleError,
      // These two are annoying during development
      retry: false,
      refetchOnWindowFocus: false,
      // This is disabled because it causes a bug with arrays with named keys
      // For example, if a query returns: [BN, BN, a: BN, b: BN]
      // with this option on it will be cached as: [BN, BN]
      // and break our code
      structuralSharing: false,
    },
  },
});

type FuelProviderProps = {
  children?: ReactNode;
};

export const ACCOUNT_KEY = 'account';
export const IS_CONNECTED_KEY = 'isConnected';

type FuelReactContextType = {
  fuel: Fuel | undefined;
};

export const FuelReactContext = createContext<FuelReactContextType | null>(
  null
);

export const useFuelReactContext = () => {
  return useContext(FuelReactContext) as FuelReactContextType;
};

export const FuelProvider = ({ children }: FuelProviderProps) => {
  const fuel = useFuel();

  function onAccountChange() {
    fuelQueryClient.invalidateQueries([ACCOUNT_KEY]);
  }

  function onConnectionChange() {
    fuelQueryClient.invalidateQueries([IS_CONNECTED_KEY]);
  }

  useEffect(() => {
    fuel?.on(fuel.events.currentAccount, onAccountChange);
    fuel?.on(fuel.events.connection, onAccountChange);
    fuel?.on(fuel.events.connection, onConnectionChange);
    fuel?.on(fuel.events.accounts, onAccountChange);

    return () => {
      fuel?.off(fuel?.events.currentAccount, onAccountChange);
      fuel?.off(fuel?.events.connection, onAccountChange);
      fuel?.off(fuel.events.connection, onConnectionChange);
      fuel?.off(fuel?.events.accounts, onAccountChange);
    };
  }, [fuel]);

  return (
    <FuelReactContext.Provider value={{ fuel }}>
      <QueryClientProvider client={fuelQueryClient}>
        {children}
      </QueryClientProvider>
    </FuelReactContext.Provider>
  );
};
