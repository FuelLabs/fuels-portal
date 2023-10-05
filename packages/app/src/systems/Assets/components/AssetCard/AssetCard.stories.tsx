import { cssObj } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';
import { ethLogoSrc } from '~/systems/Chains';

import { AssetCard } from './AssetCard';

export default {
  component: AssetCard,
  title: 'AssetCard',
  parameters: {
    layout: 'fullscreen',
  },
};
// TODO: fix stories
export const Usage = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard imageSrc={ethLogoSrc} name="ETH" />
    </CardList>
  );
};

export const AvatarUsage = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard name="ETH" hash="0x15db4a4d9e35fa8c0b5f92b13924d1610c5d618e" />
    </CardList>
  );
};

export const OnPress = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard
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
      <AssetCard
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
      <AssetCard
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

export const OnFaucet = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard
        imageSrc={ethLogoSrc}
        name="ETH"
        onFaucet={() => {
          // eslint-disable-next-line no-console
          console.log('faucet');
        }}
      />
    </CardList>
  );
};

export const OnRemoveDisabled = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard
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
