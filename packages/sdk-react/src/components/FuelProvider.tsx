/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Fuel } from '@fuel-wallet/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';

import { useWindowFuel } from '../hooks/useWindowFuel';
import { QUERY_KEYS } from '../utils';

export const fuelQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
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

export type FuelReactContextType = {
  fuel: Fuel | undefined;
};

export const FuelReactContext = createContext<FuelReactContextType | null>(
  null
);

export const useFuel = () => {
  return useContext(FuelReactContext) as FuelReactContextType;
};

export const FuelProvider = ({ children }: FuelProviderProps) => {
  const fuel = useWindowFuel();

  function onCurrentAccountChange() {
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.account],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.account],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.wallet],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.balance],
    });
  }

  function onConnectionChange() {
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.account],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.isConnected],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.wallet],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.balance],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.provider],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.nodeInfo],
    });
  }

  function onNetworkChange() {
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.provider],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.transactionReceipts],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.chain],
    });
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.nodeInfo],
    });
  }

  function onAccountsChange() {
    fuelQueryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.account],
    });
  }

  useEffect(() => {
    fuel?.on(fuel.events.currentAccount, onCurrentAccountChange);
    fuel?.on(fuel.events.connection, onConnectionChange);
    fuel?.on(fuel.events.accounts, onAccountsChange);
    fuel?.on(fuel.events.network, onNetworkChange);

    return () => {
      fuel?.off(fuel.events.currentAccount, onCurrentAccountChange);
      fuel?.off(fuel.events.connection, onConnectionChange);
      fuel?.off(fuel.events.accounts, onAccountsChange);
      fuel?.off(fuel.events.network, onNetworkChange);
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
