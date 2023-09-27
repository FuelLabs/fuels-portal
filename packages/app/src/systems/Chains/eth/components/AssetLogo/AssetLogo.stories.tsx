import { cssObj } from '@fuel-ui/css';
import { CardList } from '@fuel-ui/react';
import { ETH_ASSET } from '~/systems/Chains';

import { AssetLogo } from './AssetLogo';

export default {
  component: AssetLogo,
  title: 'AssetLogo',
  parameters: {
    layout: 'fullscreen',
  },
};

export const ETH = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetLogo asset={ETH_ASSET} />
    </CardList>
  );
};

export const Big = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetLogo asset={ETH_ASSET} size={40} />
    </CardList>
  );
};

export const Generated = () => {
  return (
    <CardList css={styles.storybook}>
      <AssetLogo asset={{ address: '0x123' }} />
    </CardList>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '386px',
  }),
};
