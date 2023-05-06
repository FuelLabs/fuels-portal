module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    'storybook-addon-react-router-v6',
  ],
  staticDirs: ['../public'],
  framework: { name: '@storybook/react-vite' },
  core: { builder: '@storybook/builder-vite' },
  features: {
    storyStoreV7: true,
  },
  docs: {
    autodocs: true,
  },
};
