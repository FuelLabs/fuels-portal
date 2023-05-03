import {
  ThemeProvider,
  useFuelTheme,
  darkTheme,
  lightTheme,
} from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { useTheme } from '../hooks';

export function FuelUiProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const { setTheme, current } = useFuelTheme();

  useEffect(() => {
    console.log('theme', theme);
    console.log('current: ', current);
    console.log('should switch to dark: ', theme === 'dark');
    setTheme(theme === 'dark' ? darkTheme : lightTheme);
  }, [theme]);

  useEffect(() => {
    console.log('current changed to: ', current);
  }, [current]);

  return <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>;
}
