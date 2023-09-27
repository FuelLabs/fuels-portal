import { cssObj } from '@fuel-ui/css';
import { Dialog, Box, Button, Text } from '@fuel-ui/react';
import { BridgeSteps, BridgeTxOverview } from '~/systems/Bridge';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

import { useTxFuelToEth } from '../hooks';

export function TxFuelToEthDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, status, handlers, date, asset } = useTxFuelToEth({
    txId: metadata.txId,
  });

  return (
    <>
      <Dialog.Close aria-label="Close Transaction Dialog" />
      <Dialog.Heading>
        Withdrawal
        <Box css={styles.divider} />
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack gap="$2">
          <Text color="intentsBase12">Status</Text>
          <BridgeSteps steps={steps} />
          <Box css={styles.border} />
          <BridgeTxOverview
            transactionId={shortAddress(metadata.txId)}
            date={date}
            isDeposit={false}
            asset={asset}
          />
        </Box.Stack>
      </Dialog.Description>
      {(status?.isWaitingEthWalletApproval ||
        status?.isConfirmTransactionLoading) && (
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
  border: cssObj({
    my: '$4',
    borderBottom: '1px solid $border',
  }),
  actionButton: cssObj({
    width: '$full',
  }),
  divider: cssObj({
    h: '1px',
    bg: '$border',
    mt: '$5',
  }),
};
