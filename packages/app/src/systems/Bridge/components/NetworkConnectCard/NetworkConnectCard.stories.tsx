import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';

import imageSrc from '../../../../../public/fuel-logo.svg';

import { NetworkConnectCard } from './NetworkConnectCard';

export default {
  component: NetworkConnectCard,
  title: 'NetworkConnectCard',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Flex align="center" justify="center" css={styles.storybook}>
      <NetworkConnectCard
        networkName="Fuel"
        networkImageUrl={imageSrc}
        heading="To"
        isConnecting={false}
        onConnect={() => {}}
      />
    </Flex>
  );
};

export const Loading = () => {
  return (
    <Flex align="center" justify="center" css={styles.storybook}>
      <NetworkConnectCard
        networkName="Fuel"
        networkImageUrl={imageSrc}
        heading="To"
        isConnecting={true}
        onConnect={() => {}}
      />
    </Flex>
  );
};

export const ConnectedAccount = () => {
  return (
    <Flex align="center" justify="center" css={styles.storybook}>
      <NetworkConnectCard
        networkName="Fuel"
        networkImageUrl={imageSrc}
        heading="To"
        isConnecting={false}
        onConnect={() => {}}
        currentAccount="fuel14kz7u7jpd8txfe2vtgh5hxjx4wk7s03kq8hcl2k7slwe3yqh5sas974464"
      />
    </Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
  }),
};
