import { ThemeProvider } from '@fuel-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
};

export const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>;
    </QueryClientProvider>
  );
}
