import { Flex, Button } from '@fuel-ui/react';
import { useState } from 'react';

import { AccountSwitch } from './AccountSwitch';

export default {
  component: AccountSwitch,
  title: 'AccountSwitch',
  parameters: {
    layout: 'fullscreen',
  },
};

const accounts = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0xe802CeF9a62531b925FDDDeA9Bb19466c8393379',
];

export const Usage = () => {
  return (
    <Flex align="center" justify="center">
      <AccountSwitch
        open={true}
        accounts={accounts}
        onSelect={() => {}}
        onConnect={() => {}}
        onDisconnect={() => {}}
      />
    </Flex>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Flex align="center" justify="center">
      <AccountSwitch
        open={open}
        accounts={accounts}
        onSelect={() => {}}
        onConnect={() => {}}
        onDisconnect={() => {}}
      />
      <Button onPress={() => setOpen(!open)}>Toggle Popup</Button>
    </Flex>
  );
};
