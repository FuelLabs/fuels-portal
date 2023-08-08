import { cssObj } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';

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
    <CardList css={styles.storybook}>
      <EthAssetCard imageSrc={ethLogoSrc} name="ETH" />
    </CardList>
  );
};

export const AvatarUsage = () => {
  return (
    <CardList css={styles.storybook}>
      <EthAssetCard
        name="ETH"
        hash="0x15db4a4d9e35fa8c0b5f92b13924d1610c5d618e"
      />
    </CardList>
  );
};

export const OnPress = () => {
  return (
    <CardList css={styles.storybook}>
      <EthAssetCard
        imageSrc={ethLogoSrc}
        name="ETH"
        onPress={() => {
          // eslint-disable-next-line no-console
          console.log('press');
        }}
      />
    </CardList>
  );
};

export const OnAdd = () => {
  return (
    <CardList css={styles.storybook}>
      <EthAssetCard
        imageSrc={ethLogoSrc}
        name="ETH"
        onAdd={() => {
          // eslint-disable-next-line no-console
          console.log('add');
        }}
      />
    </CardList>
  );
};

export const OnRemove = () => {
  return (
    <CardList css={styles.storybook}>
      <EthAssetCard
        imageSrc={ethLogoSrc}
        name="ETH"
        onRemove={() => {
          // eslint-disable-next-line no-console
          console.log('remove');
        }}
      />
    </CardList>
  );
};

export const OnRemoveDisabled = () => {
  return (
    <CardList css={styles.storybook}>
      <EthAssetCard
        imageSrc={ethLogoSrc}
        name="ETH"
        onRemove={() => {
          // eslint-disable-next-line no-console
          console.log('remove');
        }}
        isRemoveDisabled
      />
    </CardList>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '386px',
  }),
};
