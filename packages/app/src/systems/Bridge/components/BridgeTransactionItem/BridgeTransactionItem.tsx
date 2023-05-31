import { cssObj } from '@fuel-ui/css';
import { Box, Text, Image, Icon, FuelLogo } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { useTxEthToFuel } from '~/systems/Chains';

type BridgeTransactionItemProps = {
  age: string;
  asset: {
    assetImageSrc: string;
    assetAmount: string;
    assetSymbol: string;
  };
  status: ReactNode;
  onClick: () => void;
  transactionHash: string;
  isWithdraw: boolean;
  key: string;
};

export const BridgeTransactionItem = ({
  age,
  asset,
  status,
  onClick,
  transactionHash,
  isWithdraw,
  key,
}: BridgeTransactionItemProps) => {
  const { steps } = useTxEthToFuel({
    id: transactionHash,
  });

  return (
    <Box.Flex
      key={key}
      justify="space-between"
      onClick={() => {
        if (transactionHash) {
          onClick();
        }
      }}
    >
      <Text css={styles.ageText}>{age}</Text>
      {isWithdraw ? (
        <Box.Flex css={styles.directionInfo}>
          <Image width={14} height={14} src={asset.assetImageSrc} />
          <Icon icon="ArrowNarrowRight" />
          <FuelLogo size={14} />
        </Box.Flex>
      ) : (
        <Box.Flex css={styles.directionInfo}>
          <FuelLogo size={14} />
          <Icon icon="ArrowNarrowRight" />
          <Image width={14} height={14} src={asset.assetImageSrc} />
        </Box.Flex>
      )}
      <Box.Flex css={styles.txItem}>
        <Box.Flex css={styles.directionInfo}>
          <Image width={14} height={14} src={asset.assetImageSrc} />
          <Text css={styles.infoText}>{asset.assetAmount}</Text>
          <Text css={styles.infoText}>{asset.assetSymbol}</Text>
        </Box.Flex>
      </Box.Flex>
      {steps && steps[3].status}
    </Box.Flex>
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
    minWidth: '88px',
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
