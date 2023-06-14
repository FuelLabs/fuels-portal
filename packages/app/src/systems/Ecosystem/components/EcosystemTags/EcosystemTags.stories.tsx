import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { EcosystemTags } from './EcosystemTags';

export default {
  component: EcosystemTags,
  title: 'EcosystemTags',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  const TAGS = [
    'DeFi',
    'NFTs',
    'DAOs',
    'Social',
    'Lending',
    'Games',
    'DEX',
    'Stablecoins',
    'Infrastructure',
  ];

  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <EcosystemTags tags={TAGS} />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
