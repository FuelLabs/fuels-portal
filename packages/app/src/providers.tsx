import { FuelConfig } from '@fuels-portal/hooks';
import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import { ConnectProvider, FuelUiProvider } from './systems/Settings';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <FuelConfig>
        <ConnectProvider>
          <FuelUiProvider>{children}</FuelUiProvider>
        </ConnectProvider>
      </FuelConfig>
    </StoreProvider>
  );
}
