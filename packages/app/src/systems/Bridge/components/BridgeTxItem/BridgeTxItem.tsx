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
  txHash: string;
  status: ReactNode;
};

export const BridgeTxItem = ({
  date,
  asset,
  onClick,
  txHash,
  fromLogo,
  toLogo,
  status,
}: BridgeTxItemProps) => {
  return (
    <CardList.Item onClick={onClick}>
      <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
      <Box.Flex css={styles.directionInfo}>
        {fromLogo}
        <Icon icon="ArrowNarrowRight" />
        {toLogo}
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Box.Flex css={styles.directionInfo}>
          <Image width={14} height={14} src={asset.assetImageSrc} />
          <Text css={styles.infoText}>{asset.assetAmount}</Text>
          <Text css={styles.infoText}>{asset.assetSymbol}</Text>
        </Box.Flex>
      </Box.Flex>
      {status}
    </CardList.Item>
  );
};

const styles = cssObj({
  header: cssObj({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  body: cssObj({
    minHeight: '$56',
  }),
  footer: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }),
  ageText: cssObj({
    fontSize: '$xs',
    minWidth: '104px',
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
  }),
  paginationText: cssObj({
    fontSize: `$sm`,
  }),
  connectButton: cssObj({
    width: '$50',
  }),
});
