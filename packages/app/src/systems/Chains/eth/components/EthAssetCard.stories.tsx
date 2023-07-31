import { cssObj } from '@fuel-ui/css';
import { Box, Image, IconButton } from '@fuel-ui/react';

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
      <EthAssetCard icon={<Image alt=" " src={ethLogoSrc} />} name="ETH" />
    </Box.Flex>
  );
};

export const OnPress = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <EthAssetCard
        icon={<Image alt=" " src={ethLogoSrc} />}
        name="ETH"
        onPress={() => {
          // eslint-disable-next-line no-console
          console.log('press');
        }}
      />
    </Box.Flex>
  );
};

export const OnAdd = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <EthAssetCard
        icon={<Image alt=" " src={ethLogoSrc} />}
        name="ETH"
        onAdd={() => {
          // eslint-disable-next-line no-console
          console.log('add');
        }}
      />
    </Box.Flex>
  );
};

export const OnRemove = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
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
          />
        }
      />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '386px',
  }),
};
