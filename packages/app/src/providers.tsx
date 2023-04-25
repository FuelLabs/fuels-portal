import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import { AccountProviderFuel } from './systems/Accounts';
import { WagmiProvider } from './systems/Settings';
import { FuelUiProvider } from './systems/Settings/providers/FuelUiProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <WagmiProvider>
        <AccountProviderFuel>
          <FuelUiProvider>{children}</FuelUiProvider>
        </AccountProviderFuel>
      </WagmiProvider>
    </StoreProvider>
  );
}
