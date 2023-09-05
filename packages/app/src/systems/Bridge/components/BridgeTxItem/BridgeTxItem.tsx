import { cssObj } from '@fuel-ui/css';
import { Box, Text, Image, Icon, CardList } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { calculateDateDiff } from '~/systems/Core';

type BridgeTxItemProps = {
  date?: Date;
  fromLogo: ReactNode;
  toLogo: ReactNode;
  asset?: {
    assetImageSrc?: ReactNode | string;
    assetAmount?: string;
    assetSymbol?: string;
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
    <CardList.Item onClick={onClick} css={styles.cardItem}>
      <Box.Flex gap={'$1'}>
        {fromLogo}
        <Icon icon="ArrowNarrowRight" />
        {toLogo}
      </Box.Flex>
      <Box.Flex align="center" gap="$1">
        {typeof asset?.assetImageSrc === 'string' ? (
          <Image
            width={18}
            height={18}
            src={asset.assetImageSrc}
            alt={asset.assetSymbol}
          />
        ) : (
          asset?.assetImageSrc
        )}
        <Text
          aria-label="Asset amount"
          fontSize="sm"
          css={styles.assetAmountText}
        >
          {asset?.assetAmount} {asset?.assetSymbol}
        </Text>
      </Box.Flex>
      <Box.Flex css={styles.statusTime} justify={'space-between'}>
        <Text css={styles.ageText}>{calculateDateDiff(date)}</Text>
        <Box.Flex css={styles.statusColumn} align="center" justify="flex-end">
          {status}
        </Box.Flex>
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = cssObj({
  cardItem: cssObj({
    // This mean height ensure that the component will
    // have the same size of the loader
    minHeight: 24,
    gap: '$6',
    alignItems: 'center',
  }),
  statusTime: cssObj({
    flex: 1,
    '@media (max-width: 400px)': {
      flexDirection: 'column-reverse',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      gap: '$1',
    },
  }),
  line: cssObj({
    flex: 1,
  }),
  ageText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  assetAmountText: cssObj({
    color: '$intentsBase12',
  }),
});
