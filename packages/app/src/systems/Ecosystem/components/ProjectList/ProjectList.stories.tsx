import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import type { Project } from '../ProjectItem';

import { ProjectList } from './ProjectList';

const SAMPLE_PROJECTS: Project[] = [
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'live',
  },
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'in-development',
  },
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'testnet',
  },
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'in-development',
  },
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'in-development',
  },
  {
    name: 'Fuel',
    description: 'Fuel is a fast, scalable, and user-friendly payment network.',
    tags: ['wallet', 'payments', 'ethereum', 'layer2'],
    url: 'https://fuel.sh',
    status: 'in-development',
  },
];

const meta: Meta<typeof ProjectList> = {
  component: ProjectList,
  title: 'Ecosystem / ProjectList',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ProjectList>;

export const Usage: Story = {
  render: (args) => (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <ProjectList {...args} />
    </Box.Flex>
  ),
  args: { projects: SAMPLE_PROJECTS },
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
