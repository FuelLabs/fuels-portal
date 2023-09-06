import { cssObj } from '@fuel-ui/css';
import { Box, Image, FuelLogo, Text } from '@fuel-ui/react';
import { ethLogoSrc } from '~/systems/Chains';

import { BridgeTxItem } from './BridgeTxItem';

export default {
  component: BridgeTxItem,
  title: 'BridgeTxItem',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => {
  return (
    <Box.Flex align="center" justify="center" css={styles.storybook}>
      <BridgeTxItem
        fromLogo={
          <Image width={18} height={18} src={ethLogoSrc} alt={'ETH logo'} />
        }
        toLogo={<FuelLogo size={17} />}
        date={new Date()}
        asset={{
          amount: '0.050',
          symbol: 'ETH',
          image: ethLogoSrc,
        }}
        onClick={() => {}}
        status={
          <Text fontSize="xs" color="intentsBase11">
            Settled
          </Text>
        }
      />
    </Box.Flex>
  );
};

const styles = {
  storybook: cssObj({
    margin: '20px',
    width: '328px',

    '@md': {
      width: '$sm',
    },
  }),
};
