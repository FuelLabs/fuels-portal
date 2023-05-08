import { ThemeProvider } from '@fuel-ui/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { StoreProvider } from '../src/store';

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

export const decorators = [
  withRouter,
  (Story) => (
    <StoreProvider>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </StoreProvider>
  ),
];
