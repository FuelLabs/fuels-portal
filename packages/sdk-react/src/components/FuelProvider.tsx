import type { Fuel } from '@fuel-wallet/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useContext, createContext, useEffect } from 'react';

import { useWindowFuel } from '../hooks';
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

type FuelReactContextType = {
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
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet, '*']);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance, '*']);
  }

  function onConnectionChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet, '*']);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance, '*']);
  }

  function onNetworkChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.transactionReceipts]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.chain]);
  }

  function onAccountsChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
  }

  function listenerAccountFetcher() {
    console.log('invalidating balance');
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance, '*']);
    fuelQueryClient.refetchQueries([QUERY_KEYS.balance, '*']);
  }

  useEffect(() => {
    console.log('adding events');
    fuel?.on(fuel.events.currentAccount, onCurrentAccountChange);
    fuel?.on(fuel.events.connection, onConnectionChange);
    fuel?.on(fuel.events.accounts, onAccountsChange);
    fuel?.on(fuel.events.network, onNetworkChange);
    window.addEventListener('focus', listenerAccountFetcher);

    return () => {
      console.log('removing events');
      fuel?.off(fuel.events.currentAccount, onCurrentAccountChange);
      fuel?.off(fuel.events.connection, onConnectionChange);
      fuel?.off(fuel.events.accounts, onAccountsChange);
      fuel?.off(fuel.events.network, onNetworkChange);
      window.removeEventListener('focus', listenerAccountFetcher);
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
