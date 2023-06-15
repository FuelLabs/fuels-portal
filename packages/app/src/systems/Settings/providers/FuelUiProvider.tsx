import { darkColors, lightColors } from '@fuel-ui/css';
import { ThemeProvider, createTheme } from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';

import { useTheme } from '../hooks';

export function FuelUiProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();

  const darkTheme = createTheme('fuels-portal_dark-theme', {
    tokens: {
      colors: {
        ...darkColors,
        cardBg: '$intentsBase0',
        inputBaseBg: '$intentsBase0',
      },
    },
  });
  const lightTheme = createTheme('fuels-portal_light-theme', {
    tokens: {
      colors: {
        ...lightColors,
        cardBg: '$intentsBase0',
        inputBaseBg: '$intentsBase0',
      },
    },
  });

  const themes = { dark: darkTheme, light: lightTheme };

  return (
    <ThemeProvider initialTheme={theme} themes={themes}>
      {children}
    </ThemeProvider>
  );
}
