import { Box, Button } from '@fuel-ui/react';
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
    <Box css={{ width: '640px' }}>
      <FuelInstallPopup open={true} />
    </Box>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <FuelInstallPopup open={open} />
      <Button onPress={() => setOpen(!open)}>Toggle Popup</Button>
    </Box>
  );
};
