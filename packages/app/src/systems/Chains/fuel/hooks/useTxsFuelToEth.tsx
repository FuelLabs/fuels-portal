import { useQuery } from '@tanstack/react-query';
import type { ReceiptMessageOut } from 'fuels';
import {
  fromTai64ToUnix,
  ReceiptCoder,
  ReceiptType,
  arrayify,
  bn,
} from 'fuels';
import { useMemo } from 'react';

import type { BridgeTx } from '~/systems/Bridge';
import {
  ETH_CHAIN,
  ETH_SYMBOL,
  FUEL_CHAIN,
  FUEL_UNITS,
  FuelTxCache,
  ethLogoSrc,
  useFuelAccountConnection,
} from '~/systems/Chains';
import { getGraphqlClient } from '~/systems/Core';

export const useTxsFuelToEth = () => {
  const { address, provider } = useFuelAccountConnection();
  // TODO: we should use sdk to get transactions
  // TODO: how can we filter this in a better way I don't think graphql is allowing custom filters??
  const { data: transactionsByOwner, isFetching } = useQuery(
    ['transactionsByOwner'],
    async () => {
      const { transactionsByOwner } = await getGraphqlClient(
        provider?.url || ''
      ).AddressTransactions({
        owner: address?.toB256() || '',
        first: 1000,
      });

      return transactionsByOwner || null;
    },
    {
      enabled: !!address && !!provider?.url,
    }
  );

  const txs: BridgeTx[] | undefined = useMemo(() => {
    const txs = transactionsByOwner?.edges.reduce((prev, cur) => {
      const txId = cur.node.id;
      const decodedReceipts = (cur.node.receipts || []).map(
        ({ rawPayload }) => {
          const [decoded] = new ReceiptCoder().decode(arrayify(rawPayload), 0);

          return decoded;
        }
      );

      const messageOutReceipt = decodedReceipts.find(
        ({ type }) => type === ReceiptType.MessageOut
      ) as ReceiptMessageOut;

      if (messageOutReceipt) {
        let date;
        switch (cur.node.status?.type) {
          case 'SubmittedStatus':
          case 'FailureStatus':
          case 'SuccessStatus': {
            date = cur.node.status?.time
              ? new Date(fromTai64ToUnix(cur.node.status?.time) * 1000)
              : undefined;
            break;
          }
          // eslint-disable-next-line no-empty
          default: {
          }
        }

        prev.push({
          asset: {
            assetAmount: bn(messageOutReceipt.amount).format({
              precision: 9,
              units: FUEL_UNITS,
            }),
            assetImageSrc: ethLogoSrc,
            assetSymbol: ETH_SYMBOL,
          },
          date,
          txHash: txId,
          fromNetwork: FUEL_CHAIN,
          toNetwork: ETH_CHAIN,
          isDone: FuelTxCache.getTxIsDone(txId || '') === 'true',
        });
      }

      return prev;
    }, [] as BridgeTx[]);

    return txs;
  }, [JSON.stringify(transactionsByOwner)]);

  return {
    txs,
    isLoading: isFetching,
  };
};
