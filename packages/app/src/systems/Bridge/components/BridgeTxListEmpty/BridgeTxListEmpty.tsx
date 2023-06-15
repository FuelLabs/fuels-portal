// TODO: don't use light colors once https://github.com/FuelLabs/fuel-ui/issues/246
// is fixed
import { lightColors, cssObj } from '@fuel-ui/css';
import { Box, Card, ContentLoader, Text, Button } from '@fuel-ui/react';

type BridgeTxListEmptyProps = {
  isConnecting: boolean;
  hideConnectButton?: boolean;
  onClick: () => void;
};

export const BridgeTxListEmpty = ({
  isConnecting,
  hideConnectButton,
  onClick,
}: BridgeTxListEmptyProps) => {
  return (
    <Card.Body css={styles.body}>
      <Box.Stack justify="center" gap="$4">
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={lightColors.intentsBase3}
          foregroundColor={lightColors.intentsBase3}
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={lightColors.intentsBase2}
          foregroundColor={lightColors.intentsBase2}
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={lightColors.intentsBase1}
          foregroundColor={lightColors.intentsBase1}
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
        {!hideConnectButton && (
          <>
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
          </>
        )}
      </Box.Stack>
    </Card.Body>
  );
};

const styles = cssObj({
  body: cssObj({
    minHeight: '$56',
  }),
  connectButton: cssObj({
    width: '$50',
  }),
});
