import { cssObj, globalCss } from '@fuel-ui/css';
import {
  darkTheme,
  lightTheme,
  loadIcons,
  setFuelThemes,
  ThemeProvider,
} from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';

// eslint-disable-next-line import/no-absolute-path
import icons from '/icons/sprite.svg';

const globalStyles = cssObj({
  ':root': {
    '--colors-inputBaseBg': 'var(--colors-dialogBg)',
    '--colors-cardBg': 'var(--colors-intentsBase1)',
  },
});

loadIcons(icons);
setFuelThemes({
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
});

export function FuelUiProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      {globalCss(globalStyles)()}
      {children}
    </ThemeProvider>
  );
}
