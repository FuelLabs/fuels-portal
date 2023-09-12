import {
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
  FuelConnectorProvider,
} from '@fuels-portal/sdk-react';
import type { ReactNode } from 'react';

import { useTheme } from '../hooks';

type ProvidersProps = {
  children: ReactNode;
};

export function FuelConnectProvider({ children }: ProvidersProps) {
  const { theme } = useTheme();

  return (
    <FuelConnectorProvider
      theme={theme}
      connectors={[FUEL_WALLET_DEVELOPMENT_CONNECTOR]}
    >
      {children}
    </FuelConnectorProvider>
  );
}
