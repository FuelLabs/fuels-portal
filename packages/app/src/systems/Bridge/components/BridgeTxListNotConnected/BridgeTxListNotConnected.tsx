// TODO: don't use light colors once https://github.com/FuelLabs/fuel-ui/issues/246
// is fixed
import { cssObj } from '@fuel-ui/css';
import { Box, Text, Button } from '@fuel-ui/react';

import { BridgeTxItemsLoading } from '../BridgeTxItemsLoading';

type BridgeTxListEmptyProps = {
  isConnecting: boolean;
  onClick: () => void;
};

export const BridgeTxListNotConnected = ({
  isConnecting,
  onClick,
}: BridgeTxListEmptyProps) => {
  return (
    <Box.Stack justify="center" gap="$4">
      <BridgeTxItemsLoading />
      <Box.Flex justify="center">
        <Text fontSize="lg" color="intentsBase12">
          Connect your wallet to see transactions
        </Text>
      </Box.Flex>
      <Box.Flex justify="center">
        <Button
          isLoading={isConnecting}
          onPress={onClick}
          intent="primary"
          css={styles.connectButton}
        >
          Connect Fuel Wallet
        </Button>
      </Box.Flex>
    </Box.Stack>
  );
};

const styles = cssObj({
  body: cssObj({
    // minHeight: '$28',
  }),
  connectButton: cssObj({
    width: '$50',
  }),
});
