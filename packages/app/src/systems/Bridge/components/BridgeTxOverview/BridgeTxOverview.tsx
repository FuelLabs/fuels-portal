import { cssObj } from '@fuel-ui/css';
import { Box, Text, FuelLogo, Image, Icon } from '@fuel-ui/react';
import type { BigNumberish } from 'fuels';
import { calculateDateDiff } from '~/systems/Core';

import type { BridgeAsset } from '../../types';

type BridgeTxOverviewProps = {
  transactionId: BigNumberish;
  date?: Date;
  isDeposit?: boolean;
  asset?: BridgeAsset;
};

export const BridgeTxOverview = ({
  transactionId,
  date,
  isDeposit,
  asset,
}: BridgeTxOverviewProps) => {
  return (
    <Box.Stack css={styles.stack}>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>ID</Text>
        <Text css={styles.infoText}>{transactionId.toString()}</Text>
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>Age</Text>
        <Text css={styles.infoText}>{calculateDateDiff(date)}</Text>
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>Direction</Text>
        {isDeposit ? (
          <Box.Flex css={styles.directionInfo}>
            <Text css={styles.subtleText}>(Deposit)</Text>
            <Image width={18} height={18} src={asset?.image} alt={'Deposit'} />
            <Icon icon="ArrowNarrowRight" />
            <FuelLogo size={17} />
          </Box.Flex>
        ) : (
          <Box.Flex css={styles.directionInfo}>
            <Text css={styles.subtleText}>(Withdrawal)</Text>
            <FuelLogo size={17} />
            <Icon icon="ArrowNarrowRight" />
            <Image
              width={18}
              height={18}
              src={asset?.image}
              alt={'withdrawal'}
            />
          </Box.Flex>
        )}
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>Asset</Text>
        <Box.Flex css={styles.directionInfo}>
          <Image
            width={18}
            height={18}
            src={asset?.image}
            alt={asset?.symbol}
          />
          <Text aria-label="Asset amount" css={styles.infoText}>
            {asset?.amount}
          </Text>
          <Text css={styles.infoText}>{asset?.symbol}</Text>
        </Box.Flex>
      </Box.Flex>
    </Box.Stack>
  );
};

const styles = {
  stack: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }),
  labelText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase11',
  }),
  subtleText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase10',
  }),
  infoText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
};
