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
  'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
  'fuel18tgq97czurjpvmrmxn8hejre84fjff5auvdjc4d3m9x9yn2r6rhqwcxl96',
];

export const Usage = () => {
  return (
    <Flex align="center" justify="center">
      <AccountSwitch open={true} accounts={accounts} onSelect={() => {}} />
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
