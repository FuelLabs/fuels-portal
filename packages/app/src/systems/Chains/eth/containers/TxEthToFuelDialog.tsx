import { cssObj } from '@fuel-ui/css';
import { Box, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';
import { formatUnits } from 'fuels';

import { useTxEthToFuel } from '../hooks';
import { ETH_UNITS, ethLogoSrc } from '../utils';

import { BridgeTxOverview, BridgeSteps } from '~/systems/Bridge';
import { shortAddress } from '~/systems/Core';
import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, handlers, ethTx, age } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading css={styles.dialogHeading}>
        <Box.Flex justify="space-between" css={styles.dialogHeadingText}>
          <Text fontSize="sm" color="intentsBase8">
            Transaction: {shortAddress(metadata.txId)}
          </Text>
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
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>
        <BridgeTxOverview
          transactionId={shortAddress(metadata.txId)}
          age={age}
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
  dialogDescription: cssObj({
    borderBottom: '1px solid $intentsBase8',
  }),
};
