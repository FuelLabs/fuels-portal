import { cssObj } from '@fuel-ui/css';
import { Card, Box, Text, Button } from '@fuel-ui/react';

type BridgeTxListEmptyProps = {
  isConnecting: boolean;
  onClick: () => void;
};

export const BridgeTxListNotConnected = ({
  isConnecting,
  onClick,
}: BridgeTxListEmptyProps) => {
  return (
    <Card variant="outlined">
      <Card.Body css={styles.cardBody}>
        <Box.Stack justify="center" align="center" gap="$6">
          <Box.Stack justify="center" align="center" gap="$1">
            <Text fontSize="lg" color="intentsBase12">
              Wallet not detected
            </Text>
            <Text color="intentsBase10" fontSize="sm">
              Connect a wallet to see your transactions
            </Text>
          </Box.Stack>
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
      </Card.Body>
    </Card>
  );
};

const styles = {
  connectButton: cssObj({
    width: 180,
  }),
  cardBody: cssObj({
    py: '$8',
  }),
};
