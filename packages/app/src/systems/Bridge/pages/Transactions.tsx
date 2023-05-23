import { cssObj } from '@fuel-ui/css';
import { Card, Text, Box, Pagination } from '@fuel-ui/react';

export const Transactions = () => {
  return (
    <Card>
      <Card.Header css={styles.header}>
        <Text>Age</Text>
        <Text>Direction</Text>
        <Text>Asset</Text>
        <Text>Status</Text>
      </Card.Header>
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
});
