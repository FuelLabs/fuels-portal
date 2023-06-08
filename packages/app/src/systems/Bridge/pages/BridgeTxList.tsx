import { cssObj } from '@fuel-ui/css';
import { Card, Text, CardList } from '@fuel-ui/react';

import { BridgeTxListEmpty } from '../components';
import { useBridgeTxs } from '../hooks';

import {
  useFuelAccountConnection,
  TxListItemEthToFuel,
  isEthChain,
  isFuelChain,
} from '~/systems/Chains';

export const BridgeTxList = () => {
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
            <CardList isClickable>
              {txData &&
                txData.map((txDatum, index) => {
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
          />
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
});
