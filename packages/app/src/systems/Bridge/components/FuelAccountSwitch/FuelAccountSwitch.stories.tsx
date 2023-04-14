import { Flex } from '@fuel-ui/react';

import { FuelAccountSwitch } from './FuelAccountSwitch';

import { Providers } from '~/providers';

export default {
  component: FuelAccountSwitch,
  title: 'FuelAccountSwitch',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Providers>
      <Flex align="center" justify="center">
        <FuelAccountSwitch open={true} onSelect={() => {}} />
      </Flex>
    </Providers>
  );
};
