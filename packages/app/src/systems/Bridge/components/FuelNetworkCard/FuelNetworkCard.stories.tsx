import { Flex } from '@fuel-ui/react';

import { FuelNetworkCard } from './FuelNetworkCard';

import { Providers } from '~/providers';

export default {
  component: FuelNetworkCard,
  title: 'FuelNetworkCard',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Providers>
      <Flex align="center" justify="center">
        <FuelNetworkCard heading="To" />
      </Flex>
    </Providers>
  );
};
