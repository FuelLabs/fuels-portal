import { cssObj } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';
import assetList from '@fuels/assets';

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
      <AssetCard asset={assetList[0]} />
    </CardList>
  );
};

export const AvatarUsage = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard asset={assetList[0]} />
    </CardList>
  );
};

export const OnPress = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetCard
        asset={assetList[0]}
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
        asset={assetList[0]}
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
        asset={assetList[0]}
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
        asset={assetList[0]}
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
        asset={assetList[0]}
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
