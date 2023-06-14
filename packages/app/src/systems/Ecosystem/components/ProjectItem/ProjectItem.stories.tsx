import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProjectItem, type Project } from './ProjectItem';

const SAMPLE_PROJECT: Project = {
  name: 'Fuel',
  description: 'Fuel is a fast, scalable, and user-friendly payment network.',
  tags: ['wallet', 'payments', 'ethereum', 'layer2'],
  url: 'https://fuel.sh',
  status: 'live',
};

const meta: Meta<typeof ProjectItem> = {
  component: ProjectItem,
  title: 'Ecosystem / ProjectItem',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    status: {
      options: ['live', 'testnet', 'in-development'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectItem>;

export const Usage: Story = {
  render: (args) => (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <ProjectItem {...args} />
    </Box.Flex>
  ),
  args: SAMPLE_PROJECT,
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
