import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import { useTxEthToFuel } from '../hooks';
import { ethLogoSrc } from '../utils';

import { BridgeTxItem } from '~/systems/Bridge';

type TxListItemEthToFuelProps = {
  asset: {
    assetImageSrc: ReactNode | string;
    assetAmount: string;
    assetSymbol: string;
  };
  txHash: string;
  isDone?: boolean;
};

export const TxListItemEthToFuel = ({
  asset,
  txHash,
  isDone,
}: TxListItemEthToFuelProps) => {
  const { steps, ethBlockDate, handlers } = useTxEthToFuel({
    id: txHash,
    skipAnalyzeTx: isDone,
  });

  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (isDone || steps?.at(3)?.isDone)
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
      fromLogo={<Image width={18} height={18} src={ethLogoSrc} />}
      toLogo={<FuelLogo size={17} />}
      date={ethBlockDate}
      asset={asset}
      onClick={() => handlers.openTxEthToFuel({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
