import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import { WagmiProvider } from './systems/Settings';
import { FuelUiProvider } from './systems/Settings/providers/FuelUiProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <WagmiProvider>
        <FuelUiProvider>{children}</FuelUiProvider>
      </WagmiProvider>
    </StoreProvider>
  );
}
