import { Image, FuelLogo, Text, Box, Spinner } from '@fuel-ui/react';
import { BridgeTxItem } from '~/systems/Bridge';

import { useTxEthToFuel } from '../hooks';
import { ethLogoSrc } from '../utils';

type TxListItemEthToFuelProps = {
  txHash: string;
};

export const TxListItemEthToFuel = ({ txHash }: TxListItemEthToFuelProps) => {
  const { steps, date, handlers, asset, status } = useTxEthToFuel({
    id: txHash,
  });

  const bridgeTxStatus = steps?.find(({ isSelected }) => !!isSelected);

  function getStatusComponent() {
    if (status?.isReceiveDone)
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
          alt={asset?.assetSymbol}
        />
      }
      toLogo={<FuelLogo size={17} />}
      date={date}
      asset={asset}
      onClick={() => handlers.openTxEthToFuel({ txId: txHash })}
      status={getStatusComponent()}
    />
  );
};
