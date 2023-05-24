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
import { useAccount, useMessages } from '@fuels-portal/sdk-react';

import { FUEL_CHAIN, ethLogoSrc, useMessageSent } from '~/systems/Chains';

export const Transactions = () => {
  const { account } = useAccount();
  const { messages } = useMessages(account, 10, FUEL_CHAIN.providerUrl);

  const { logs } = useMessageSent();

  console.log('logs', logs);

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
            {messages &&
              messages.map((message, index) => {
                return (
                  <Box.Flex
                    key={`${index}-${message.nonce}`}
                    justify="space-between"
                  >
                    <Text>5 days ago</Text>
                    <Box.Flex css={styles.directionInfo}>
                      <Image width={14} height={14} src={ethLogoSrc} />
                      <Icon icon="ArrowNarrowRight" />
                      <FuelLogo size={14} />
                    </Box.Flex>
                    <Box.Flex css={styles.txItem}>
                      <Box.Flex css={styles.directionInfo}>
                        <Image width={14} height={14} src={ethLogoSrc} />
                        <Text css={styles.infoText}>1.500</Text>
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
            <Pagination.Prev />
            <Pagination.Items />
            <Pagination.Next />
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
