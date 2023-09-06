import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import { BridgeTxItem } from '~/systems/Bridge';

import { useTxEthToFuel } from '../hooks';
import { useAsset } from '../hooks/useAsset';
import { ethLogoSrc } from '../utils';

type TxListItemEthToFuelProps = {
  asset: {
    address?: string;
    amount: string;
  };
  txHash: string;
  isDone?: boolean;
};

export const TxListItemEthToFuel = ({
  asset: { address, amount },
  txHash,
  isDone,
}: TxListItemEthToFuelProps) => {
  const { steps, ethBlockDate, handlers, status } = useTxEthToFuel({
    id: txHash,
    // TODO: can refact part of skipAnalyzeTx this could be done inside the machine and jump to done state
    skipAnalyzeTx: isDone,
  });

  const asset = useAsset({ address });
  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (isDone || status.isReceiveDone)
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
      fromLogo={
        <Image
          width={18}
          height={18}
          src={ethLogoSrc}
          alt={asset?.asset?.symbol}
        />
      }
      toLogo={<FuelLogo size={17} />}
      date={ethBlockDate}
      asset={{ ...asset, amount }}
      onClick={() => handlers.openTxEthToFuel({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
