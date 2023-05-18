import { ConnectKitProvider } from 'connectkit';
import type { ReactNode } from 'react';
import type { ChainProviderFn } from 'wagmi';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { useTheme } from '../hooks';

import {
  VITE_ALCHEMY_ID,
  VITE_INFURA_ID,
  VITE_WALLETCONNECT_ID,
} from '~/config';
import { ETH_CHAIN } from '~/systems/Chains';

const app = {
  name: 'Fuel Bridge',
  description: 'Bridge assets between Fuel and Other Chains',
  url: 'https://fuels-portal.vercel.app',
  icons: ['https://fuels-portal.vercel.app/fuel-logo.svg'],
};
const chainsToConnect = [ETH_CHAIN];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: ChainProviderFn<any, any, any>[] = [
  alchemyProvider({ apiKey: VITE_ALCHEMY_ID, priority: 1 }),
  infuraProvider({ apiKey: VITE_INFURA_ID, priority: 2 }),
  jsonRpcProvider({
    rpc: (c) => {
      return { http: c.rpcUrls.default.http[0] };
    },
    priority: 3,
  }),
  publicProvider({ priority: 4 }),
];
const { provider, chains, webSocketProvider } = configureChains(
  chainsToConnect,
  providers
);
const connectKitClient = {
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: app.name,
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        showQrModal: false,
        projectId: VITE_WALLETCONNECT_ID,
        metadata: app,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
      },
    }),
  ],
  provider,
  webSocketProvider,
};

const client = createClient(connectKitClient);

type ProvidersProps = {
  children: ReactNode;
};

export function ConnectProvider({ children }: ProvidersProps) {
  const { theme } = useTheme();

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider mode={theme}>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
