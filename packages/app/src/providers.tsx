import { FuelProvider } from '@fuel-wallet/react';
import type { ReactNode } from 'react';

import { StoreProvider } from './store';
import {
  ConnectProvider,
  FuelUiProvider,
  FuelConnectProvider,
} from './systems/Settings';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      <FuelProvider>
        <FuelConnectProvider>
          <ConnectProvider>
            <FuelUiProvider>{children}</FuelUiProvider>
          </ConnectProvider>
        </FuelConnectProvider>
      </FuelProvider>
    </StoreProvider>
  );
}
