import { bn } from 'fuels';
import { useEffect, useMemo, useState } from 'react';

import type { BridgeTx } from '~/systems/Bridge/types';
import {
  useEthDepositLogs,
  ethLogoSrc,
  ETH_SYMBOL,
  FUEL_UNITS,
  ETH_CHAIN,
  FUEL_CHAIN,
  ethToFuelStorage,
} from '~/systems/Chains';

export const useTxsEthToFuel = () => {
  const { logs, isFetching } = useEthDepositLogs();

  const txs: BridgeTx[] | undefined = useMemo(() => {
    return logs?.map((log) => {
      const txDatum = {
        asset: {
          assetAmount: bn(log.event.args.amount.toString()).format({
            precision: 9,
            units: FUEL_UNITS,
          }),
          assetImageSrc: ethLogoSrc,
          assetSymbol: ETH_SYMBOL,
        },
        date: log.date,
        txHash: log.transactionHash || '0x',
        fromNetwork: ETH_CHAIN,
        toNetwork: FUEL_CHAIN,
        isDone:
          ethToFuelStorage.getItem(`ethToFuelTx${log.transactionHash}-done`) ===
          'true',
      };
      return txDatum;
    });
  }, [logs]);

  return {
    txs,
    isLoading: isFetching,
  };
};
