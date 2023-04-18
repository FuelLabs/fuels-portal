import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { StoreProvider } from './store';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  );
}
