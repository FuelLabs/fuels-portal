import { FuelProvider } from '@fuels-portal/sdk-react';
import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import { FuelUiProvider } from './systems/Settings';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <FuelProvider>
        <FuelUiProvider>{children}</FuelUiProvider>
      </FuelProvider>
    </StoreProvider>
  );
}
