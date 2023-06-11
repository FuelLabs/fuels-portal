import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

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
    if (bridgeTxStatus?.isLoading)
      return (
        <Box.Flex align="center" gap="$1">
          <Spinner size={14} />
          <Text fontSize="xs">Processing</Text>
        </Box.Flex>
      );

    return '';
  }

  return (
    <BridgeTxItem
      fromLogo={<FuelLogo size={14} />}
      toLogo={<Image width={14} height={14} src={ethLogoSrc} />}
      date={date}
      asset={asset}
      onClick={() => handlers.openTxFuelToEth({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
