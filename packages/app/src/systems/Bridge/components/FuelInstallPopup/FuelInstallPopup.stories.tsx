import { Button, Flex } from '@fuel-ui/react';
import { useState } from 'react';

import { FuelInstallPopup } from './FuelInstallPopup';

export default {
  component: FuelInstallPopup,
  title: 'FuelInstallPopup',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Flex align="center" justify="center" css={{ width: '640px' }}>
      <FuelInstallPopup open={true} />
    </Flex>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Flex align="center" justify="center">
      <FuelInstallPopup open={open} />
      <Button onPress={() => setOpen(!open)}>Toggle Popup</Button>
    </Flex>
  );
};
