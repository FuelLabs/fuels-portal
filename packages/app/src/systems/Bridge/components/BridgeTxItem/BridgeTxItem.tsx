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
    <CardList.Item onClick={onClick} css={styles.listItem}>
      <Box.Flex css={styles.wrapper}>
        <Box css={bridgeTxListStyles.ageColumn}>
          <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
        </Box>
        <Box.Flex
          css={{
            ...bridgeTxListStyles.directionColumn,
            ...styles.directionInfo,
          }}
        >
          {fromLogo}
          <Icon icon="ArrowNarrowRight" />
          {toLogo}
        </Box.Flex>
        <Box.Flex css={{ ...bridgeTxListStyles.assetColumn, ...styles.txItem }}>
          {typeof asset.assetImageSrc === 'string' ? (
            <Image width={18} height={18} src={asset.assetImageSrc} />
          ) : (
            asset.assetImageSrc
          )}
          <Text css={styles.infoText}>{asset.assetAmount}</Text>
          <Text css={styles.infoText}>{asset.assetSymbol}</Text>
        </Box.Flex>
        <Box css={bridgeTxListStyles.statusColumn}>{status}</Box>
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = cssObj({
  listItem: cssObj({
    flexDirection: 'column',
    border: '1px solid $intentsBase6 !important',
    backgroundColor: '$intentsBase0',
    width: '344px',

    '@md': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: '$4 !important',
      width: '$full',
      border: '1px solid $intentsBase6 !important',
      backgroundColor: '$intentsBase0',
    },
  }),
  wrapper: cssObj({
    alignItems: 'start',
    flexDirection: 'column',

    '@md': {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },
  }),
  txItem: cssObj({
    gap: '$1',
    alignItems: 'center',
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
  }),
});
