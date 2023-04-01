import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const client = createClient({
  provider: getDefaultProvider(),
});

type ProvidersProps = {
  children: ReactNode;
};

export const queryClient = new QueryClient({
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

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiConfig client={client}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
