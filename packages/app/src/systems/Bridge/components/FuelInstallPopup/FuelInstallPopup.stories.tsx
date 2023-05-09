import { cssObj } from '@fuel-ui/css';
import { Button, Box } from '@fuel-ui/react';
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
    <Box.Flex css={styles.storybook}>
      <FuelInstallPopup open={true} />
    </Box.Flex>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box.Flex css={styles.storybook}>
      <FuelInstallPopup open={open} />
      <Button onPress={() => setOpen(!open)}>Toggle Popup</Button>
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
