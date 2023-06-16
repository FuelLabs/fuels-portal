import { cssObj } from '@fuel-ui/css';
import { Card, Text, CardList, Box } from '@fuel-ui/react';

import {
  BridgeListEmpty,
  BridgeTxItemsLoading,
  BridgeTxListNotConnected,
} from '../components';
import { useBridgeTxs } from '../hooks';
import { bridgeTxListStyles } from '../styles';

import {
  useFuelAccountConnection,
  TxListItemEthToFuel,
  isEthChain,
  isFuelChain,
  TxListItemFuelToEth,
} from '~/systems/Chains';
import { coreStyles } from '~/systems/Core';

export const BridgeTxList = () => {
  const { isConnected, isConnecting, handlers } = useFuelAccountConnection();
  const { txs: bridgeTxs, isLoading } = useBridgeTxs();

  console.log('is loading', isLoading);
  return (
    <Card css={coreStyles.card}>
      <Card.Header css={styles.header}>
        <Text
          fontSize="sm"
          color="intentsBase10"
          css={bridgeTxListStyles.ageColumn}
        >
          Age
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase10"
          css={bridgeTxListStyles.directionColumn}
        >
          Direction
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase10"
          css={bridgeTxListStyles.assetColumn}
        >
          Asset
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase10"
          css={bridgeTxListStyles.statusColumn}
        >
          Status
        </Text>
      </Card.Header>
      <Card.Body css={styles.body}>
        {isLoading && <BridgeTxItemsLoading />}

        {isConnected && !isLoading ? (
          <>
            {bridgeTxs.length > 0 ? (
              <CardList isClickable>
                {bridgeTxs.map((txDatum, index) => {
                  if (
                    isEthChain(txDatum.fromNetwork) &&
                    isFuelChain(txDatum.toNetwork)
                  ) {
                    return (
                      <TxListItemEthToFuel
                        key={`${index}-${txDatum.txHash}`}
                        txHash={txDatum.txHash || ''}
                        asset={txDatum.asset}
                        isDone={txDatum.isDone}
                      />
                    );
                  }
                  if (
                    isFuelChain(txDatum.fromNetwork) &&
                    isEthChain(txDatum.toNetwork)
                  ) {
                    return (
                      <TxListItemFuelToEth
                        key={`${index}-${txDatum.txHash}`}
                        txHash={txDatum.txHash || ''}
                        asset={txDatum.asset}
                        isDone={txDatum.isDone}
                        date={txDatum.date}
                      />
                    );
                  }

                  return null;
                })}
              </CardList>
            ) : (
              <BridgeListEmpty />
            )}
          </>
        ) : (
          <>
            {!isConnected && (
              <Box.Stack gap="$4">
                <BridgeTxListNotConnected
                  isConnecting={isConnecting}
                  onClick={handlers.connect}
                />
              </Box.Stack>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

const styles = cssObj({
  header: cssObj({
    alignItems: 'center',
    px: '$0',
    mx: '$4',
    borderBottom: '1px solid $border',
  }),
  body: cssObj({
    minHeight: '$56',
  }),
});
