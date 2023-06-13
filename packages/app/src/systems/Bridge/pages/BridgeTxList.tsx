import { cssObj } from '@fuel-ui/css';
import { Card, Text, CardList } from '@fuel-ui/react';

import { BridgeTxListEmpty } from '../components';
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
  const bridgeTxs = useBridgeTxs();

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
      {isConnected ? (
        <>
          <Card.Body css={styles.body}>
            <CardList isClickable>
              {bridgeTxs &&
                bridgeTxs.map((txDatum, index) => {
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
          </Card.Body>
        </>
      ) : (
        <>
          <BridgeTxListEmpty
            isConnecting={isConnecting}
            onClick={handlers.connect}
            hideConnectButton={isConnected}
          />
        </>
      )}
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
