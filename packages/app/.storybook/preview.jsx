import {
  ThemeProvider,
  darkTheme,
  lightTheme,
  useFuelTheme,
} from '@fuel-ui/react';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from '@storybook/theming';

import { StoreProvider } from '../src/store';
import { useEffect } from 'react';

import theme from './theme';

export const parameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
  darkMode: {
    stylePreview: true,
    dark: {
      ...themes.dark,
      ...theme,
      appBg: '#101010',
      barBg: '#151515',
    },
    light: {
      ...themes.light,
      ...theme,
    },
    darkClass: darkTheme.theme.className,
    lightClass: lightTheme.theme.className,
  },
};

function ThemeWrapper(props) {
  const isDark = useDarkMode();
  const { setTheme } = useFuelTheme();

  useEffect(() => {
    setTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  return <ThemeProvider>{props.children}</ThemeProvider>;
}

export const decorators = [
  (Story) => (
    // <StoreProvider>
    <ThemeWrapper>
      <Story />
    </ThemeWrapper>
    // </StoreProvider>
  ),
];
