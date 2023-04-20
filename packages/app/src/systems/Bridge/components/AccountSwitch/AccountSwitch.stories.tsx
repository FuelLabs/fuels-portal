import { Flex, Button } from '@fuel-ui/react';
import type { StoryFn, Meta } from '@storybook/react';

import { useAccountSwitch } from '../../hooks/useAccountSwitch';

import { AccountSwitch } from './AccountSwitch';

import { Layout } from '~/systems/Core';

export default {
  component: AccountSwitch,
  title: 'AccountSwitch',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Template: StoryFn<typeof AccountSwitch> = () => {
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

export const Usage = Template.bind({});
