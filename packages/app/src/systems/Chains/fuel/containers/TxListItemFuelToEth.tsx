import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import { BridgeTxItem } from '~/systems/Bridge';

import { ethLogoSrc } from '../../eth';
import { ActionRequiredBadge } from '../components';
import { useTxFuelToEth } from '../hooks';

type TxListItemFuelToEthProps = {
  txHash: string;
};

export const TxListItemFuelToEth = ({ txHash }: TxListItemFuelToEthProps) => {
  const { steps, handlers, asset, date, status } = useTxFuelToEth({
    txId: txHash,
  });

  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (status.isReceiveDone)
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
        <Image
          width={18}
          height={18}
          src={ethLogoSrc}
          alt={asset.assetSymbol}
        />
      }
      date={date}
      asset={asset}
      onClick={() => handlers.openTxFuelToEth({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
