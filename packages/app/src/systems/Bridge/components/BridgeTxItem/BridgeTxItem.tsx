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
      <Box.Flex align="center" justify="space-between" css={styles.wrapper}>
        <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
        <Box.Flex css={styles.directionInfo}>
          {fromLogo}
          <Icon icon="ArrowNarrowRight" />
          {toLogo}
        </Box.Flex>
        <Box.Flex css={styles.txItem}>
          <Image width={14} height={14} src={asset.assetImageSrc} />
          <Text aria-label="Asset amount" css={styles.infoText}>
            {asset.assetAmount}
          </Text>
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
  wrapper: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
  ageText: cssObj({
    fontSize: '$xs',
    minWidth: '70px',
  }),
  infoText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
    justifyContent: 'center',
  }),
});
