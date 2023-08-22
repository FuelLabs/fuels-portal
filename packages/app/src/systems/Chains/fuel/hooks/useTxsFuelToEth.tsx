import { useQuery } from '@tanstack/react-query';
import {
  fromTai64ToUnix,
  bn,
  getTransactionsSummaries,
  getReceiptsMessageOut,
  SimplifiedTransactionStatusNameEnum,
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

export const useTxsFuelToEth = () => {
  const { address, provider } = useFuelAccountConnection();
  // TODO: we should use sdk to get transactions
  // TODO: how can we filter this in a better way I don't think graphql is allowing custom filters??
  const { data, isFetching } = useQuery(
    ['transactionsSummary'],
    async () => {
      if (!provider || !address) return undefined;

      const txSummaries = await getTransactionsSummaries(provider, {
        owner: address?.toB256(),
        first: 1000,
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
          case SimplifiedTransactionStatusNameEnum.submitted:
          case SimplifiedTransactionStatusNameEnum.failure:
          case SimplifiedTransactionStatusNameEnum.success: {
            date = txSummary.time
              ? new Date(fromTai64ToUnix(txSummary.time) * 1000)
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
