import { cssObj } from '@fuel-ui/css';
import { Box, Image, FuelLogo, Text } from '@fuel-ui/react';

import { BridgeTxItem } from './BridgeTxItem';

import { ethLogoSrc } from '~/systems/Chains';

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
        fromLogo={<Image width={18} height={18} src={ethLogoSrc} />}
        toLogo={<FuelLogo size={17} />}
        date={new Date()}
        asset={{
          assetAmount: '0.050',
          assetSymbol: 'ETH',
          assetImageSrc: <Image width={18} height={18} src={ethLogoSrc} />,
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
    width: '95%',
  }),
};
