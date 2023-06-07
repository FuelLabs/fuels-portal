import { cssObj } from '@fuel-ui/css';
import { Box, Text, Image, Icon, CardList } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { calculateDateDiff } from '~/systems/Core/utils/date';

type BridgeTxItemProps = {
  date?: Date;
  fromLogo: ReactNode;
  toLogo: ReactNode;
  asset: {
    assetImageSrc: string;
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
      <Box.Flex align="center" justify="space-between" css={{ width: '100%' }}>
        <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
        <Box.Flex css={styles.directionInfo}>
          {fromLogo}
          <Icon icon="ArrowNarrowRight" />
          {toLogo}
        </Box.Flex>
        <Box.Flex css={styles.txItem}>
          <Image width={14} height={14} src={asset.assetImageSrc} />
          <Text css={styles.infoText}>{asset.assetAmount}</Text>
          <Text css={styles.infoText}>{asset.assetSymbol}</Text>
        </Box.Flex>
        {status}
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = cssObj({
  listItem: cssObj({
    justifyContent: 'space-between',
    alignItems: 'center',
    px: '0px !important',
  }),
  body: cssObj({
    minHeight: '$56',
  }),
  footer: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    gap: '$1',
    alignItems: 'center',
    // justifyContent: 'center',
    // gridColumn: '3 / 4',
  }),
  ageText: cssObj({
    fontSize: '$xs',
    // gridColumn: '1 / 4',
    minWidth: '70px',
  }),
  labelText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase8',
  }),
  infoText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
    justifyContent: 'center',
    // gridColumn: '2 / 4',
  }),
  status: cssObj({
    // gridColumn: '4 / 4',
  }),
});
