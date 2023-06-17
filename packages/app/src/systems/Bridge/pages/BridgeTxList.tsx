import { cssObj } from '@fuel-ui/css';
import { Card, Text, CardList } from '@fuel-ui/react';

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
        {/** need to check for strict equality bc we care if isConnected is not undefined */}
        {isConnected === false && !isLoading && (
          <BridgeTxListNotConnected
            isConnecting={isConnecting}
            onClick={handlers.connect}
          />
        )}
        {isConnected && !isLoading && bridgeTxs.length === 0 && (
          <BridgeListEmpty />
        )}
        {bridgeTxs.length > 0 && isConnected && (
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
