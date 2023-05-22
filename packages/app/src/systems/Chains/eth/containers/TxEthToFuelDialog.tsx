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

import { BridgeSteps } from '../../../Bridge/components';
import { useTxEthToFuel } from '../hooks';

import { useOverlay } from '~/systems/Overlay';

export function TxEthToFuelDialog() {
  const { metadata } = useOverlay<{ txId: string }>();
  const { steps, handlers } = useTxEthToFuel({
    id: metadata.txId,
  });

  return (
    <>
      <Dialog.Heading>
        <Box.Flex justify="space-between">
          Transaction
          <IconButton
            data-action="closed"
            variant="link"
            icon={<Icon icon="X" color="gray8" />}
            aria-label="Close unlock window"
            onPress={handlers.close}
          />
        </Box.Flex>
      </Dialog.Heading>
      <Dialog.Description>
        <Box.Stack gap="$1">
          <Text css={styles.header}>Status</Text>
          <BridgeSteps steps={steps} />
          <Text css={styles.header}>Get notified when it settles</Text>
          <Box.Flex>
            <Input />
            <Button>Notify me</Button>
          </Box.Flex>
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>Temp</Dialog.Footer>
    </>
  );
}

const styles = {
  header: cssObj({
    color: '$intentsBase12',
  }),
};
