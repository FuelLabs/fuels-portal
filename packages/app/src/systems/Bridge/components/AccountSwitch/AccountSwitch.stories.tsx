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

const accounts = [
  'fuel17kx8dy6gvugrppnkvsezyyh2qxusq57mvk2hueaa9smer220knuslpsnuf',
  'fuel18tgq97czurjpvmrmxn8hejre84fjff5auvdjc4d3m9x9yn2r6rhqwcxl96',
];

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
