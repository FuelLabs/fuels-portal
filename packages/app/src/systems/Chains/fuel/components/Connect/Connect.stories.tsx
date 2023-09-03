import { cssObj } from '@fuel-ui/css';
import { Button, Box, Text } from '@fuel-ui/react';
import { FuelProvider, useAccount } from '@fuels-portal/sdk-react';

import { Connect } from './Connect';
import { MOCK_CONNECTORS } from './__mocks__/connectors';

export default {
  component: Connect,
  title: 'Connect',
  parameters: {
    layout: 'fullscreen',
  },
};

const LogAccounts = () => {
  const { account } = useAccount();

  return <Text>{account}</Text>;
};

export const Usage = () => (
  <FuelProvider>
    <Box.Stack align="center" justify="center" css={styles.storybook}>
      <Connect connectors={MOCK_CONNECTORS}>
        <Button>Connect Wallet</Button>
      </Connect>
      <LogAccounts />
    </Box.Stack>
  </FuelProvider>
);

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
