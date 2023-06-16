// TODO: don't use light colors once https://github.com/FuelLabs/fuel-ui/issues/246
// is fixed
import { lightColors, cssObj, darkColors } from '@fuel-ui/css';
import { Box, Card, ContentLoader, Text, Button } from '@fuel-ui/react';

import { useTheme } from '~/systems/Settings';

type BridgeTxListEmptyProps = {
  isConnecting: boolean;
  onClick: () => void;
};

export const BridgeTxListNotConnected = ({
  isConnecting,
  onClick,
}: BridgeTxListEmptyProps) => {
  const { theme } = useTheme();

  return (
    <Card.Body css={styles.body}>
      <Box.Stack justify="center" gap="$4">
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={
            theme === 'light'
              ? lightColors.intentsBase3
              : darkColors.intentsBase3
          }
          foregroundColor={
            theme === 'light'
              ? lightColors.intentsBase3
              : darkColors.intentsBase3
          }
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={
            theme === 'light'
              ? lightColors.intentsBase2
              : darkColors.intentsBase2
          }
          foregroundColor={
            theme === 'light'
              ? lightColors.intentsBase2
              : darkColors.intentsBase2
          }
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
        <ContentLoader
          speed={2}
          height="24px"
          width="100%"
          backgroundColor={
            theme === 'light'
              ? lightColors.intentsBase1
              : darkColors.intentsBase1
          }
          foregroundColor={
            theme === 'light'
              ? lightColors.intentsBase1
              : darkColors.intentsBase1
          }
        >
          <ContentLoader.Rect width="100%" height="24" rx="4" />
        </ContentLoader>
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
