import { useQuery } from '@tanstack/react-query';
import {
  fromTai64ToUnix,
  bn,
  getTransactionsSummaries,
  getReceiptsMessageOut,
  TransactionStatus,
} from 'fuels';
import { useMemo } from 'react';
import type { BridgeTx } from '~/systems/Bridge';
import {
  ETH_CHAIN,
  FUEL_CHAIN,
  FUEL_UNITS,
  FuelTxCache,
  useFuelAccountConnection,
} from '~/systems/Chains';

export const useTxsFuelToEth = () => {
  const { address, provider } = useFuelAccountConnection();
  const { data, isFetching } = useQuery(
    ['transactionsSummary'],
    async () => {
      if (!provider || !address) return undefined;

      const txSummaries = await getTransactionsSummaries({
        provider,
        filters: {
          owner: address?.toB256(),
          first: 1000,
        },
      });

      return txSummaries;
    },
    {
      enabled: !!address && !!provider?.url,
    }
  );

  const txs: BridgeTx[] | undefined = useMemo(() => {
    const txs = data?.transactions?.reduce((prev, txSummary) => {
      const messageOutReceipt = getReceiptsMessageOut(txSummary.receipts)[0];
      if (messageOutReceipt) {
        let date;
        switch (txSummary.status) {
          case TransactionStatus.submitted:
          case TransactionStatus.failure:
          case TransactionStatus.success: {
            date = txSummary.time
              ? new Date(fromTai64ToUnix(txSummary.time) * 1000)
              : undefined;
            break;
          }
          // eslint-disable-next-line no-empty
          default: {
          }
        }

        /*
        // TODO: we should refactor this to remove maximum data as possible from here.
        // We should only inform the txHash, fromNetwork and toNetwork, and the rest should be got from machine.
        */
        prev.push({
          asset: {
            amount: bn(messageOutReceipt.amount).format({
              precision: 9,
              units: FUEL_UNITS,
            }),
          },
          date,
          txHash: txSummary.id || '',
          fromNetwork: FUEL_CHAIN,
          toNetwork: ETH_CHAIN,
          isDone: FuelTxCache.getTxIsDone(txSummary.id || '') === 'true',
        });
      }

      return prev;
    }, [] as BridgeTx[]);

    return txs;
  }, [JSON.stringify(data?.transactions)]);

  return {
    txs,
    isLoading: isFetching,
  };
};
