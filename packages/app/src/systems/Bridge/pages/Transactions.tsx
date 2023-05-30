import { cssObj, darkColors, lightColors } from '@fuel-ui/css';
import {
  Card,
  Text,
  Box,
  Pagination,
  Image,
  Icon,
  FuelLogo,
  ContentLoader,
  Button,
} from '@fuel-ui/react';
import { bn } from 'fuels';

import {
  ethLogoSrc,
  useBlocks,
  useFuelAccountConnection,
  useEthDepositLogs,
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

  console.log('logs: ', logs);
  console.log('blocks: ', blocks);

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
                  events.map((event, index) => {
                    return (
                      <Box.Flex
                        key={`${index}-${event.eventName}`}
                        justify="space-between"
                        onClick={() => {
                          console.log('clickkkkkkk');
                        }}
                      >
                        <Text css={styles.ageText}>{ages[index]}</Text>
                        {event.args.recipient === fuelAddress?.toHexString() ? (
                          <Box.Flex css={styles.directionInfo}>
                            <Image width={14} height={14} src={ethLogoSrc} />
                            <Icon icon="ArrowNarrowRight" />
                            <FuelLogo size={14} />
                          </Box.Flex>
                        ) : (
                          <Box.Flex css={styles.directionInfo}>
                            <FuelLogo size={14} />
                            <Icon icon="ArrowNarrowRight" />
                            <Image width={14} height={14} src={ethLogoSrc} />
                          </Box.Flex>
                        )}
                        <Box.Flex css={styles.txItem}>
                          <Box.Flex css={styles.directionInfo}>
                            <Image width={14} height={14} src={ethLogoSrc} />
                            <Text css={styles.infoText}>
                              {bn(event.args.amount.toString()).format({
                                precision: 9,
                                units: 9,
                              })}
                            </Text>
                            <Text css={styles.infoText}>ETH</Text>
                          </Box.Flex>
                        </Box.Flex>
                        {/** blocks[index] is null if the transaction is still pending */}
                        {blocks[index] ? (
                          <Text>Settled</Text>
                        ) : (
                          <Text>Processing</Text>
                        )}
                      </Box.Flex>
                    );
                  })}
              </>
            </Box.Stack>
          </Card.Body>
          <Card.Footer>
            <Pagination
              justify="space-between"
              align="center"
              pagesCount={logs ? logs?.length / 10 : 1}
              css={styles.footer}
            >
              <Pagination.Prev />
              <Text css={styles.paginationText}>Prev</Text>
              <Pagination.Items />
              <Text css={styles.paginationText}>Next</Text>
              <Pagination.Next />
            </Pagination>
          </Card.Footer>
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
    minHeight: '224px',
  }),
  footer: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }),
  ageText: cssObj({
    fontSize: '$xs',
  }),
  labelText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase8',
  }),
  infoText: cssObj({
    fontSize: '$sm',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
  paginationText: cssObj({
    fontSize: `$sm`,
  }),
  connectButton: cssObj({
    width: '200px',
  }),
});
