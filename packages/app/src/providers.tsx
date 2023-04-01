import { ThemeProvider } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

const client = createClient({
  provider: getDefaultProvider(),
});

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiConfig client={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </WagmiConfig>
  );
}
