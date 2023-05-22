import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  Dialog,
  Icon,
  IconButton,
  Input,
  Text,
} from '@fuel-ui/react';
import { formatUnits } from 'fuels';

import { BridgeSteps } from '../../../Bridge/components';
import { useTxEthToFuel } from '../hooks';
import { ETH_UNITS, ethLogoSrc } from '../utils';

import { BridgeTxOverview } from '~/systems/Bridge/components/BridgeTxOverview';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, handlers, ethTx } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingText}>
          <Text fontSize="sm">Transaction: {shortAddress(metadata.txId)}</Text>
          <IconButton
            data-action="closed"
            variant="link"
            icon={<Icon icon="CircleX" color="intentsBase8" />}
            aria-label="Close unlock window"
            onPress={handlers.close}
          />
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description css={styles.dialogDescription}>
        <Box.Stack gap="$2">
          <Text css={styles.header}>Status</Text>
          <BridgeSteps steps={steps} />
          <Text css={styles.header}>Get notified when it settles</Text>
          <Box.Flex css={styles.emailContainer}>
            <Input css={styles.emailInput}>
              <Input.Field placeholder="Your email address" type="email" />
            </Input>
            <Button css={styles.emailButton}>Notify me</Button>
          </Box.Flex>
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>
        <BridgeTxOverview
          transactionId={shortAddress(metadata.txId)}
          age={ethTx?.blockNumber?.toString() || 'N/A'}
          isDeposit={true}
          asset={{
            assetSymbol: 'ETH',
            imageUrl: ethLogoSrc,
            assetAmount: ethTx?.value
              ? parseFloat(
                  formatUnits(ethTx.value.toString(), ETH_UNITS)
                ).toFixed(3)
              : '0',
          }}
        />
      </Dialog.Footer>
    </>
  );
}

const styles = {
  dialogHeading: cssObj({
    borderBottom: '1px solid $intentsBase8',
  }),
  dialogHeadingText: cssObj({
    paddingBottom: '$4',
  }),
  header: cssObj({
    color: '$intentsBase12',
    fontSize: '$xs',
  }),
  emailContainer: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$2',
    marginBottom: '$4',
  }),
  emailInput: cssObj({
    width: '100%',
    height: '$8',
  }),
  emailButton: cssObj({
    height: '$8',
    fontSize: '$xs',
  }),
  dialogDescription: cssObj({
    borderBottom: '1px solid $intentsBase8',
  }),
};
