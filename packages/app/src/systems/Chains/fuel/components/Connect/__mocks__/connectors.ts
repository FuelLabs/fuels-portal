import type { ConnectorList } from '../defs';

export const MOCK_CONNECTORS: ConnectorList = [
  {
    name: 'Fuel Wallet',
    image: '/connectors/fuel-wallet.svg',
    connector: 'Fuel Wallet',
    install:
      'https://chrome.google.com/webstore/detail/fuel-wallet/dldjpboieedgcmpkchcjcbijingjcgok',
  },
  {
    name: 'Fuel Wallet Development',
    image: '/connectors/fuel-wallet-dev.svg',
    connector: 'Fuel Wallet Development',
    install: 'https://next-wallet.fuel.network',
  },
  {
    name: 'Fuelet',
    image: {
      light: '/connectors/fuelet-light.svg',
      dark: '/connectors/fuelet-dark.svg',
    },
    connector: 'Fuelet',
    install: '',
  },
];
