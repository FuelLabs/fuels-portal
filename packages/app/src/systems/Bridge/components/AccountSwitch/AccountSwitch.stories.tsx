import { Flex, Button } from '@fuel-ui/react';
import { useState } from 'react';

import { useAccountSwitch } from '../../hooks/useAccountSwitch';

import { AccountSwitch } from './AccountSwitch';

import { Layout } from '~/systems/Core';

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
  const { handlers } = useAccountSwitch();
  return (
    <Layout>
      <Flex align="center" justify="center">
        <Button onPress={handlers.openAccountSwitch}>
          Open Account Switch
        </Button>
      </Flex>
    </Layout>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <Flex align="center" justify="center">
      <AccountSwitch
        accounts={accounts}
        onSelect={() => {}}
        onConnect={() => {}}
        onDisconnect={() => {}}
      />
      <Button onPress={() => setOpen(!open)}>Toggle Popup</Button>
    </Flex>
  );
};
