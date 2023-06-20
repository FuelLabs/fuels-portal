import { cssObj } from '@fuel-ui/css';
import { Dialog, Box, Button, Text } from '@fuel-ui/react';

import { ETH_SYMBOL, ethLogoSrc } from '../../eth';
import { useTxFuelToEth } from '../hooks';

import { BridgeSteps, BridgeTxOverview } from '~/systems/Bridge';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function TxFuelToEthDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, status, handlers, fuelTxDate, fuelTxAmount } = useTxFuelToEth({
    txId: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Text fontSize="sm" color="intentsBase12">
            Transaction: {shortAddress(metadata.txId)}
          </Text>
          <Dialog.Close />
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
            date={fuelTxDate}
            isDeposit={false}
            asset={{
              assetSymbol: ETH_SYMBOL,
              imageUrl: ethLogoSrc,
              assetAmount: fuelTxAmount,
            }}
          />
        </Box.Stack>
      </Dialog.Description>
      {(status.isWaitingEthWalletApproval ||
        status.isConfirmTransactionLoading) && (
        <Dialog.Footer>
          <Button
            onPress={handlers.relayToEth}
            intent="primary"
            css={styles.actionButton}
            isLoading={status.isConfirmTransactionLoading}
          >
            Confirm Transaction
          </Button>
        </Dialog.Footer>
      )}
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
    width: '$full',
  }),
};
