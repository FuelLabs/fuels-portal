import { cssObj, lightColors } from '@fuel-ui/css';
import { Card, Text, Box, ContentLoader, Button } from '@fuel-ui/react';
import { bn } from 'fuels';

import { store } from '~/store';
import {
  ethLogoSrc,
  useBlocks,
  useFuelAccountConnection,
  useEthDepositLogs,
  TxListItemEthToFuel,
} from '~/systems/Chains';

export const Transactions = () => {
  const {
    address: fuelAddress,
    isConnected,
    isConnecting,
    handlers,
  } = useFuelAccountConnection();
  const { events, blockHashes, logs } = useEthDepositLogs();
  const { blocks, ages } = useBlocks(blockHashes);

  return (
    <Card>
      <Card.Header css={styles.header}>
        <Text>Age</Text>
        <Text>Direction</Text>
        <Text>Asset</Text>
        <Text>Status</Text>
      </Card.Header>
      {isConnected ? (
        <>
          <Card.Body css={styles.body}>
            <Box.Stack>
              <>
                {events &&
                  ages &&
                  blockHashes &&
                  blocks &&
                  logs &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  events.map((event: any, index: number) => {
                    return (
                      <TxListItemEthToFuel
                        key={`${index}-${event.eventName}`}
                        age={ages[index]}
                        onClick={() => {
                          if (logs && logs[index].transactionHash) {
                            store.openTxEthToFuel({
                              txId: logs[index].transactionHash!,
                            });
                          }
                        }}
                        txHash={logs[index].transactionHash || ''}
                        asset={{
                          assetAmount: bn(event.args.amount.toString()).format({
                            precision: 9,
                            units: 9,
                          }),
                          assetImageSrc: ethLogoSrc,
                          assetSymbol: 'ETH',
                        }}
                      />
                    );
                  })}
              </>
            </Box.Stack>
          </Card.Body>
        </>
      ) : (
        <>
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
              <Box.Flex justify="center">
                <Text fontSize="lg" color="intentsBase12">
                  Connect your wallet to see transactions
                </Text>
              </Box.Flex>
              <Box.Flex justify="center">
                <Button
                  isLoading={isConnecting}
                  onPress={handlers.connect}
                  css={styles.connectButton}
                >
                  Connect Fuel Wallet
                </Button>
              </Box.Flex>
            </Box.Stack>
          </Card.Body>
        </>
      )}
    </Card>
  );
};

const styles = cssObj({
  header: cssObj({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  body: cssObj({
    minHeight: '$56',
  }),
  connectButton: cssObj({
    width: '$50',
  }),
});
