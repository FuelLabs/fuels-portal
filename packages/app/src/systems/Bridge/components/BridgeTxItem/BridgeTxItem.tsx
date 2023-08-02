import { cssObj } from '@fuel-ui/css';
import { Box, Text, Image, Icon, CardList } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { bridgeTxListStyles } from '../../styles';

import { calculateDateDiff } from '~/systems/Core';

type BridgeTxItemProps = {
  date?: Date;
  fromLogo: ReactNode;
  toLogo: ReactNode;
  asset: {
    assetImageSrc: ReactNode | string;
    assetAmount: string;
    assetSymbol: string;
  };
  onClick: () => void;
  status: ReactNode;
};

export const BridgeTxItem = ({
  date,
  asset,
  onClick,
  fromLogo,
  toLogo,
  status,
}: BridgeTxItemProps) => {
  return (
    <CardList.Item onClick={onClick} css={styles.listItem} variant="outlined">
      <Box.Flex css={styles.wrapper}>
        <Box css={bridgeTxListStyles.ageColumn}>
          <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
        </Box>
        <Box.Flex
          gap="$2"
          align="center"
          justify="space-between"
          css={{ minWidth: '264px', alignSelf: 'stretch', width: '100%' }}
        >
          <Box.Flex css={styles.directionInfo}>
            {fromLogo}
            <Icon icon="ArrowNarrowRight" />
            {toLogo}
          </Box.Flex>
          <Box.Flex css={styles.txItem}>
            {typeof asset.assetImageSrc === 'string' ? (
              <Image width={18} height={18} src={asset.assetImageSrc} />
            ) : (
              asset.assetImageSrc
            )}
            <Text aria-label="Asset amount" css={styles.infoText}>
              {asset.assetAmount}
            </Text>
            <Text css={styles.infoText}>{asset.assetSymbol}</Text>
          </Box.Flex>
          <Box.Flex css={bridgeTxListStyles.statusColumn} justify="center">
            {status}
          </Box.Flex>
        </Box.Flex>
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = cssObj({
  listItem: cssObj({
    flexDirection: 'column',
    backgroundColor: '$intentsBase0',
    alignSelf: 'stretch',

    '@md': {
      flexDirection: 'row',
      alignItems: 'center',
      p: '$4 !important',
      alignSelf: 'stretch',
      backgroundColor: '$intentsBase0',
    },
  }),
  wrapper: cssObj({
    alignItems: 'start',
    flexDirection: 'column',
    width: '100%',

    '@md': {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },
  }),
  txItem: cssObj({
    gap: '$1',
    alignItems: 'center',
    flexGrow: 1,
  }),
  ageText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  infoText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
    flexGrow: 1,
  }),
});
