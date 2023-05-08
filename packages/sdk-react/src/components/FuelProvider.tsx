import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

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

export const FuelProvider = ({ children }: FuelProviderProps) => {
  return (
    <QueryClientProvider client={fuelQueryClient}>
      {children}
    </QueryClientProvider>
  );
};
