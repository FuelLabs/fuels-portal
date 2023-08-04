import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { EthAssetCard } from './EthAssetCard';

import { ethLogoSrc } from '~/systems/Chains';

export default {
  component: EthAssetCard,
  title: 'EthAssetCard',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard name="ETH" />
      </Box>
    </Box.Flex>
  );
};

export const AvatarUsage = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard name="ETH" />
      </Box>
    </Box.Flex>
  );
};

export const OnPress = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard
          name="ETH"
          onPress={() => {
            // eslint-disable-next-line no-console
            console.log('press');
          }}
        />
      </Box>
    </Box.Flex>
  );
};

export const OnAdd = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard
          name="ETH"
          onAdd={() => {
            // eslint-disable-next-line no-console
            console.log('add');
          }}
        />
      </Box>
    </Box.Flex>
  );
};

export const OnRemove = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard
          name="ETH"
          onRemove={() => {
            // eslint-disable-next-line no-console
            console.log('remove');
          }}
        />
      </Box>
    </Box.Flex>
  );
};

export const OnRemoveDisabled = () => {
  return (
    <Box.Flex
      direction="column"
      align="center"
      justify="center"
      css={styles.storybook}
    >
      <Box css={styles.container}>
        <EthAssetCard
          imageSrc={ethLogoSrc}
          name="ETH"
          onRemove={() => {
            // eslint-disable-next-line no-console
            console.log('remove');
          }}
          isRemoveDisabled
        />
      </Box>
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '386px',
  }),
  container: cssObj({
    width: '$full',
  }),
};
