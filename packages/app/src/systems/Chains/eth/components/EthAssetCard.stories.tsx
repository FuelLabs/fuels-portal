import { cssObj } from '@fuel-ui/css';
import { Box, Image, IconButton, Avatar } from '@fuel-ui/react';

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
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <Box css={styles.container}>
        <EthAssetCard icon={<Image alt=" " src={ethLogoSrc} />} name="ETH" />
      </Box>
    </Box.Flex>
  );
};

export const AvatarUsage = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <Box css={styles.container}>
        <EthAssetCard
          icon={
            <Avatar.Generated
              height="20px"
              width="20px"
              hash="0x15db4a4d9e35fa8c0b5f92b13924d1610c5d618e"
            />
          }
          name="ETH"
        />
      </Box>
    </Box.Flex>
  );
};

export const OnPress = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <Box css={styles.container}>
        <EthAssetCard
          icon={<Image alt=" " src={ethLogoSrc} />}
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
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <Box css={styles.container}>
        <EthAssetCard
          icon={<Image alt=" " src={ethLogoSrc} />}
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
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <Box css={styles.container}>
        <EthAssetCard
          icon={<Image alt=" " src={ethLogoSrc} />}
          name="ETH"
          removeIconButton={
            <IconButton
              aria-label={'RemoveEthAsset'}
              variant="ghost"
              icon="SquareRoundedX"
              color="scalesRed10"
              onPress={() => {
                // eslint-disable-next-line no-console
                console.log('remove');
              }}
              size="xs"
            />
          }
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
