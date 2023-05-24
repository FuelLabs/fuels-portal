import { cssObj } from '@fuel-ui/css';
import { Box, Button, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

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

  function getButtonText() {
    if (!steps) {
      return { shouldHideButton: true };
    }
    if (steps[1].isLoading) {
      return {
        text: 'Waiting on settlement',
        isDiabled: true,
      };
    }
    if (steps[2].isDone) {
      return {
        shouldHideButton: true,
      };
    }
    return {
      text: 'Confirm transaction',
      isDisabled: false,
    };
  }

  const buttonTextObj = getButtonText();

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
            age={age}
            isDeposit={true}
            asset={{
              assetSymbol: 'ETH',
              imageUrl: ethLogoSrc,
              assetAmount: bn(ethTx?.value.toString()).format({
                precision: 9,
                units: ETH_UNITS,
              }),
            }}
          />
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>
        {!buttonTextObj.shouldHideButton && (
          <Button
            isDisabled={buttonTextObj.isDiabled}
            css={styles.actionButton}
          >
            {buttonTextObj.text}
          </Button>
        )}
      </Dialog.Footer>
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
