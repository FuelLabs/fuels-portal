import { ThemeProvider, useFuelTheme } from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { useTheme } from '../hooks';

export function FuelUiProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const { setTheme } = useFuelTheme();

  // TODO fix: theme toggle (could still be an issue in fuel-ui)
  useEffect(() => {
    setTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  return <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>;
}
