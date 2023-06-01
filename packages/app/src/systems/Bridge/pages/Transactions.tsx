import { cssObj, lightColors } from '@fuel-ui/css';
import { Card, Text, Box, ContentLoader, Button } from '@fuel-ui/react';
import { bn } from 'fuels';

import { useBridgeTxs } from '../hooks';

import { store } from '~/store';
import {
  ethLogoSrc,
  useFuelAccountConnection,
  TxListItemEthToFuel,
} from '~/systems/Chains';

export const Transactions = () => {
  const { isConnected, isConnecting, handlers } = useFuelAccountConnection();
  const txData = useBridgeTxs();

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
                {txData &&
                  txData.map((txDatum, index) => {
                    return (
                      <TxListItemEthToFuel
                        key={`${index}-${txDatum.log.transactionHash}`}
                        age={txDatum.age!}
                        onClick={() => {
                          if (txDatum.log.transactionHash) {
                            store.openTxEthToFuel({
                              txId: txDatum.log.transactionHash!,
                            });
                          }
                        }}
                        txHash={txDatum.log.transactionHash || ''}
                        asset={{
                          assetAmount: bn(
                            txDatum.event.args.amount.toString()
                          ).format({
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
