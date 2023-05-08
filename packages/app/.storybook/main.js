import tsconfigpath from 'vite-tsconfig-paths';
import { mergeConfig } from 'vite';

module.exports = {
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
