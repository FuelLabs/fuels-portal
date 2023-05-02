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
  // const { theme } = useTheme();
  // const { setTheme, themes, current } = useFuelTheme();

  // console.log('here: ', themes);
  // console.log('current: ', current);

  // useEffect(() => {
  //   console.log('theme', theme);
  //   console.log('temp: ', current === 'dark');
  //   setTheme(current === 'dark' ? lightTheme : darkTheme);
  // }, [theme]);

  return <ThemeProvider>{children}</ThemeProvider>;
}
