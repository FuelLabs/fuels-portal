import { cssObj } from '@fuel-ui/css';
import { Box, Text, FuelLogo, Image, Icon } from '@fuel-ui/react';
import type { BigNumberish } from 'fuels';

type BridgeTxOverviewProps = {
  transactionId: BigNumberish;
  age: string;
  isDeposit?: boolean;
  asset: {
    imageUrl?: string;
    assetSymbol?: string;
    assetAmount: string;
  };
};

export const BridgeTxOverview = ({
  transactionId,
  age,
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
        <Text css={styles.infoText}>{age}</Text>
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>Direction</Text>
        {isDeposit ? (
          <Box.Flex css={styles.directionInfo}>
            <Text css={styles.labelText}>(Deposit)</Text>
            <Image width={14} height={14} src={asset.imageUrl} />
            <Icon icon="ArrowNarrowRight" />
            <FuelLogo size={14} />
          </Box.Flex>
        ) : (
          <Box.Flex css={styles.directionInfo}>
            <Text css={styles.labelText}>(Withdrawal)</Text>
            <FuelLogo size={14} />
            <Icon icon="ArrowNarrowRight" />
            <Image width={14} height={14} src={asset.imageUrl} />
          </Box.Flex>
        )}
      </Box.Flex>
      <Box.Flex css={styles.txItem}>
        <Text css={styles.labelText}>Asset</Text>
        <Box.Flex css={styles.directionInfo}>
          <Image width={14} height={14} src={asset.imageUrl} />
          <Text css={styles.infoText}>{asset.assetAmount}</Text>
          <Text css={styles.infoText}>{asset.assetSymbol}</Text>
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
    fontSize: '$xs',
    color: '$intentsBase11',
  }),
  infoText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
};
