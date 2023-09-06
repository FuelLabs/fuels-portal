import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import { BridgeTxItem } from '~/systems/Bridge';

import { ETH_SYMBOL, ethLogoSrc } from '../../eth';
import { ActionRequiredBadge } from '../components';
import { useTxFuelToEth } from '../hooks';

type TxListItemFuelToEthProps = {
  asset: {
    address?: string;
    amount: string;
  };
  txHash: string;
  date?: Date;
  isDone?: boolean;
};

export const TxListItemFuelToEth = ({
  asset: { address, amount },
  txHash,
  date,
  isDone,
}: TxListItemFuelToEthProps) => {
  const { steps, handlers, status } = useTxFuelToEth({
    txId: txHash,
    skipAnalyzeTx: isDone,
  });

  const asset = {
    address,
    amount,
    symbol: ETH_SYMBOL,
    image: ethLogoSrc,
  };
  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (isDone || status.isReceiveDone)
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
      return <ActionRequiredBadge />;
    }

    return '';
  }

  return (
    <BridgeTxItem
      fromLogo={<FuelLogo size={17} />}
      toLogo={
        <Image width={18} height={18} src={ethLogoSrc} alt={asset.symbol} />
      }
      date={date}
      asset={asset}
      onClick={() => handlers.openTxFuelToEth({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
