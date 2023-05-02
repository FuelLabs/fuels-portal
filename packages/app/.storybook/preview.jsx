import {
  ThemeProvider,
  darkTheme,
  lightTheme,
  useFuelTheme,
} from '@fuel-ui/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useDarkMode } from 'storybook-dark-mode';

import { StoreProvider } from '../src/store';
import { useEffect } from 'react';

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
};

function ThemeWrapper(props) {
  const isDark = useDarkMode();
  const { setTheme } = useFuelTheme();

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  return <ThemeProvider>{props.children}</ThemeProvider>;
}

export const decorators = [
  withRouter,
  (Story) => (
    <StoreProvider>
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    </StoreProvider>
  ),
];
