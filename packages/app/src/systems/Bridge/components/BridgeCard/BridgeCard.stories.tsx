import { Box } from '@fuel-ui/react';
import { BridgeCard } from './BridgeCard';
import { Providers } from '../../../../providers';

export default {
  component: BridgeCard,
  title: 'Bridge/BridgeCard',
};

export const Usage = () => {
  return (
    <Providers>
      <Box css={{ width: '640px' }}>
        <BridgeCard />
      </Box>
    </Providers>
  );
};
