import { bn } from 'fuels';
import { useMemo } from 'react';

import type { BridgeTx } from '~/systems/Bridge/types';
import {
  useEthDepositLogs,
  FUEL_UNITS,
  ETH_CHAIN,
  FUEL_CHAIN,
  EthTxCache,
} from '~/systems/Chains';

export const useTxsEthToFuel = () => {
  const { logs, isFetching } = useEthDepositLogs();

  const txs: BridgeTx[] | undefined = useMemo(() => {
    return logs?.map((log) => {
      /*
      // TODO: we should refactor this to remove maximum data as possible from here.
      // We should only inform the txHash, fromNetwork and toNetwork, and the rest should be got from machine.
      */
      const txDatum = {
        asset: {
          address: log.eventName === 'Deposit' ? log.args.tokenId : undefined,
          amount: bn(log.args.amount.toString()).format({
            precision: 9,
            units: FUEL_UNITS,
          }),
        },
        date: log.date,
        txHash: log.transactionHash || '0x',
        fromNetwork: ETH_CHAIN,
        toNetwork: FUEL_CHAIN,
        isDone: EthTxCache.getTxIsDone(log.transactionHash || '') === 'true',
      };
      return txDatum;
    });
  }, [logs]);

  return {
    txs,
    isLoading: isFetching,
  };
};
