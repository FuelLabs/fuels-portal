import { ThemeProvider } from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';

import { useTheme } from '../hooks';

export function FuelUiProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();

  return (
    <ThemeProvider key={theme} theme={theme || 'light'}>
      {children}
    </ThemeProvider>
  );
}
