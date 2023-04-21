import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import { FuelUiProvider } from './systems/Settings/providers/FuelUiProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <FuelUiProvider>{children}</FuelUiProvider>
    </StoreProvider>
  );
}
