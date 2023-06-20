import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import type { Project } from '../ProjectItem';

import { ProjectList } from './ProjectList';

const SAMPLE_PROJECTS: Project[] = [
  {
    name: 'Sway Swap',
    description:
      'SwaySwap is a blazingly fast DEX built on the fastest modular execution layer: Fuel.',
    tags: ['defi', 'swap'],
    url: 'https://fuellabs.github.io/swayswap/',
    status: 'live',
  },
  {
    name: 'Fuelet',
    description: 'Non-custodial wallet on Fuel.',
    tags: ['wallet', 'mobile', 'infra'],
    url: 'https://fuelet.app/',
    status: 'live',
  },
  {
    name: 'ThunderNFT',
    description: 'The Superior NFT Experience, on Fuel.',
    tags: ['marketplace', 'nft'],
    url: 'https://thundernft.market/',
    status: 'in-development',
  },
  {
    name: 'Orao Network',
    description: 'Oracle Service for Custom Data Feeds.',
    tags: ['oracle', 'infra'],
    url: 'https://orao.network/',
    status: 'live',
  },
  {
    name: 'SwayLend',
    description: 'First ever Lending protocol on Fuel Network.',
    tags: ['defi', 'lending'],
    url: 'https://swaylend.com/',
    status: 'testnet',
  },
  {
    name: 'Poolshark',
    description:
      'Poolshark is an open-source AMM protocol that makes it easy for users to catch directional moves from the comfort of a liquidity pool.',
    tags: ['defi', 'infra', 'amm'],
    url: 'https://docs.poolsharks.io/',
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
