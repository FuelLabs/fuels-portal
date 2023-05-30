import { cssObj } from '@fuel-ui/css';
import {
  Card,
  Text,
  Box,
  Pagination,
  Image,
  Icon,
  FuelLogo,
} from '@fuel-ui/react';
import { bn } from 'fuels';

import {
  ethLogoSrc,
  useBlocks,
  useFuelAccountConnection,
  useEthDepositLogs,
} from '~/systems/Chains';

export const Transactions = () => {
  const { address: fuelAddress } = useFuelAccountConnection();
  const { events, blockHashes, logs } = useEthDepositLogs();
  const { ages } = useBlocks(blockHashes);

  console.log('logs: ', logs);

  return (
    <Card>
      <Card.Header css={styles.header}>
        <Text>Age</Text>
        <Text>Direction</Text>
        <Text>Asset</Text>
        <Text>Status</Text>
      </Card.Header>
      <Card.Body>
        <Box.Stack>
          <>
            {events &&
              ages &&
              blockHashes &&
              events.map((event, index) => {
                return (
                  <Box.Flex
                    key={`${index}-${event.eventName}`}
                    justify="space-between"
                  >
                    <Text>{ages[index]}</Text>
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
                    <Text>Settled</Text>
                  </Box.Flex>
                );
              })}
          </>
        </Box.Stack>
      </Card.Body>
      <Card.Footer>
        <Box.Flex justify="center" align="center" css={styles.footer}>
          <Pagination pagesCount={1}>
            <Pagination.Prev>Prev</Pagination.Prev>
            <Pagination.Items />
            <Pagination.Next>Next</Pagination.Next>
          </Pagination>
        </Box.Flex>
      </Card.Footer>
    </Card>
  );
};

const styles = cssObj({
  header: cssObj({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  footer: cssObj({
    width: '100%',
  }),
  txItem: cssObj({
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }),
  labelText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase8',
  }),
  infoText: cssObj({
    fontSize: '$xs',
    color: '$intentsBase12',
  }),
  directionInfo: cssObj({
    gap: '$1',
    alignItems: 'center',
  }),
});
