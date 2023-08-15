import { ThemeProvider } from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';

export function FuelUiProvider({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
