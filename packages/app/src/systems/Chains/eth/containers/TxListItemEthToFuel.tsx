import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import { useEffect } from 'react';

import { useTxEthToFuel } from '../hooks';
import { ethLogoSrc } from '../utils';

import { BridgeTxItem } from '~/systems/Bridge';

type TxListItemEthToFuelProps = {
  asset: {
    assetImageSrc: string;
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

  useEffect(() => {
    if (steps && steps[3].isDone) {
      localStorage.setItem(`ethToFuelTx${txHash}-done`, 'true');
    }
  }, [steps]);

  return (
    <BridgeTxItem
      fromLogo={<Image width={14} height={14} src={ethLogoSrc} />}
      toLogo={<FuelLogo size={14} />}
      date={ethBlockDate}
      asset={asset}
      onClick={() => handlers.openTxEthToFuel({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
