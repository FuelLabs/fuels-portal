import { Flex } from '@fuel-ui/react';

import { AccountSwitch } from './AccountSwitch';

export default {
  component: AccountSwitch,
  title: 'AccountSwitch',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  const accounts = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0xe802CeF9a62531b925FDDDeA9Bb19466c8393379',
  ];
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
