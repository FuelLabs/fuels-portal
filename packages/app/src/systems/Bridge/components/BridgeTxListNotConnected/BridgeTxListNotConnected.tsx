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
    <Card>
      <Card.Body css={styles.cardBody}>
        <Box.Stack justify="center" gap="$4">
          <Box.Flex justify="center">
            <Text fontSize="lg" color="intentsBase12">
              Connect your wallet to see your transactions
            </Text>
          </Box.Flex>
          <Box.Flex justify="center">
            <Button
              isLoading={isConnecting}
              onPress={onClick}
              intent="primary"
              css={styles.connectButton}
            >
              <b>Connect Fuel Wallet</b>
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
    py: '$10',
  }),
};
