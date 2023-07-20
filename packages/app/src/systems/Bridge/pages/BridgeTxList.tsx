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

export const BridgeTxList = () => {
  const { isConnecting, handlers } = useFuelAccountConnection();
  const {
    txs: bridgeTxs,
    isLoading,
    shouldShowNotConnected,
    shouldShowEmpty,
    shouldShowList,
  } = useBridgeTxs();

  return (
    <Card>
      <Card.Header css={styles.header}>
        <Text
          fontSize="sm"
          color="intentsBase9"
          css={bridgeTxListStyles.ageColumn}
        >
          Age
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase9"
          css={bridgeTxListStyles.directionColumn}
        >
          Direction
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase9"
          css={bridgeTxListStyles.assetColumn}
        >
          Asset
        </Text>
        <Text
          fontSize="sm"
          color="intentsBase9"
          css={bridgeTxListStyles.statusColumn}
        >
          Status
        </Text>
      </Card.Header>
      <Card.Body css={styles.body}>
        {isLoading && <BridgeTxItemsLoading />}
        {shouldShowNotConnected && (
          <BridgeTxListNotConnected
            isConnecting={isConnecting}
            onClick={handlers.connect}
          />
        )}
        {shouldShowEmpty && <BridgeListEmpty />}
        {shouldShowList && (
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
