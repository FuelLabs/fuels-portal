import { cssObj } from '@fuel-ui/css';
import { Dialog, Box, Button, Text, Icon, IconButton } from '@fuel-ui/react';

import { ETH_SYMBOL, ethLogoSrc } from '../../eth';
import { useTxFuelToEth } from '../hooks';
import { FUEL_UNITS } from '../utils';

import { BridgeSteps, BridgeTxOverview } from '~/systems/Bridge';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function TxFuelToEthDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, isWaitingEthWalletApproval, handlers, fuelTx, fuelTxDate } =
    useTxFuelToEth({
      txId: metadata.txId,
    });

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingContainer}>
          <Text fontSize="sm" color="intentsBase12">
            Transaction: {shortAddress(metadata.txId)}
          </Text>
          <IconButton
            data-action="closed"
            variant="link"
            icon={<Icon icon="CircleX" css={styles.dialogHeadingIcon} />}
            aria-label="Close unlock window"
            onPress={handlers.close}
          />
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack gap="$2">
          <Text css={styles.header}>Status</Text>
          <BridgeSteps steps={steps} />
          <Box css={styles.border} />
          <BridgeTxOverview
            transactionId={shortAddress(metadata.txId)}
            date={fuelTxDate}
            isDeposit={true}
            asset={{
              assetSymbol: ETH_SYMBOL,
              imageUrl: ethLogoSrc,
              assetAmount: fuelTx?.outputs[0].amount.format({
                precision: 9,
                units: FUEL_UNITS,
              }),
            }}
          />
        </Box.Stack>
      </Dialog.Description>
      {isWaitingEthWalletApproval && (
        <Dialog.Footer>
          <Button onClick={handlers.relayToEth}>Confirm Transaction</Button>
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
  header: cssObj({
    color: '$intentsBase12',
    fontSize: '$xs',
  }),
  border: cssObj({
    my: '$4',
    borderBottom: '1px solid $intentsBase8',
  }),
  actionButton: cssObj({
    width: '100%',
  }),
};
