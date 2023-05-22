import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  staticDirs: ['../public'],
  core: { builder: '@storybook/builder-vite' },
  framework: { name: '@storybook/react-vite', options: {} },
  features: {
    storyStoreV7: true,
  },
  docs: {
    autodocs: true,
  },
};

export default config;
