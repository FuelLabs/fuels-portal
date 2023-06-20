import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { SAMPLE_PROJECTS } from '../../data';

import { ProjectItem, type Project } from './ProjectItem';


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
  args: SAMPLE_PROJECTS[0] as Project,
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
