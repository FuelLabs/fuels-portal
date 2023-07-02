import { cssObj } from '@fuel-ui/css';
import { Box, Dialog, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

import { useTxEthToFuel } from '../hooks';
import { ETH_SYMBOL, ETH_UNITS, ethLogoSrc } from '../utils';

import { BridgeTxOverview, BridgeSteps } from '~/systems/Bridge';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, ethTx, ethBlockDate } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Text color="intentsBase12" fontSize="sm">
            Transaction: {shortAddress(metadata.txId)}
          </Text>
          <Dialog.Close aria-label="Close Transaction Dialog" />
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack gap="$2">
          <Text fontSize="sm" color="intentsBase12">
            Status
          </Text>
          <BridgeSteps steps={steps} />
          <Box css={styles.border} />
          <BridgeTxOverview
            transactionId={shortAddress(metadata.txId)}
            date={ethBlockDate}
            isDeposit={true}
            asset={{
              assetSymbol: ETH_SYMBOL,
              imageUrl: ethLogoSrc,
              assetAmount: bn(ethTx?.value.toString()).format({
                precision: 9,
                units: ETH_UNITS,
              }),
            }}
          />
        </Box.Stack>
      </Dialog.Description>
    </>
  );
}

const styles = {
  dialogHeading: cssObj({
    borderBottom: '1px solid $intentsBase8',
  }),
  dialogHeadingContainer: cssObj({
    paddingBottom: '$4',
  }),
  dialogHeadingIcon: cssObj({
    color: '$intentsBase12 !important',
  }),
  border: cssObj({
    my: '$4',
    borderBottom: '1px solid $intentsBase8',
  }),
  actionButton: cssObj({
    width: '100%',
  }),
};
