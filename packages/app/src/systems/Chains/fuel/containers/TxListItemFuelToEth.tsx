import { cssObj } from '@fuel-ui/css';
import { Image, FuelLogo, Text, Box, Spinner, Badge } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { ethLogoSrc } from '../../eth';
import { useTxFuelToEth } from '../hooks';

import { BridgeTxItem } from '~/systems/Bridge';

type TxListItemFuelToEthProps = {
  asset: {
    assetImageSrc: ReactNode | string;
    assetAmount: string;
    assetSymbol: string;
  };
  txHash: string;
  date?: Date;
  isDone?: boolean;
};

export const TxListItemFuelToEth = ({
  asset,
  txHash,
  date,
  isDone,
}: TxListItemFuelToEthProps) => {
  const { steps, handlers } = useTxFuelToEth({
    txId: txHash,
    // TODO: add skip here when done status is implemented in FuelToEth bridge
    // skipAnalyzeTx: isDone,
  });

  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (isDone)
      return (
        <Text fontSize="xs" color="intentsBase11">
          Settled
        </Text>
      );

    if (bridgeTxStatus?.isLoading) {
      return (
        <Box.Flex align="center" gap="$1">
          <Spinner size={14} />
          <Text fontSize="xs">Processing</Text>
        </Box.Flex>
      );
    }

    if (bridgeTxStatus?.name === 'Confirm transaction') {
      return (
        <Badge css={styles.actionBadge} intent="error">
          Action Required
        </Badge>
      );
    }

    return '';
  }

  return (
    <BridgeTxItem
      fromLogo={<FuelLogo size={17} />}
      toLogo={<Image width={18} height={18} src={ethLogoSrc} />}
      date={date}
      asset={asset}
      onClick={() => handlers.openTxFuelToEth({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};

const styles = {
  actionBadge: cssObj({
    fontSize: '$xs',
    lineHeight: 1,
    padding: '$1',
    textTransform: 'none',
  }),
};
