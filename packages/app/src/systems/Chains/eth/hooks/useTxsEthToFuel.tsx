import { bn } from 'fuels';
import { useMemo } from 'react';

import { store } from '~/store';
import {
  useEthDepositLogs,
  ethLogoSrc,
  ETH_SYMBOL,
  FUEL_UNITS,
  ETH_CHAIN,
  FUEL_CHAIN,
} from '~/systems/Chains';

export const useTxsEthToFuel = () => {
  const { events, logs } = useEthDepositLogs();

  const txs = useMemo(() => {
    return logs?.map((log, index) => {
      const txDatum = {
        asset: {
          assetAmount: bn(events[index].args.amount.toString()).format({
            precision: 9,
            units: FUEL_UNITS,
          }),
          assetImageSrc: ethLogoSrc,
          assetSymbol: ETH_SYMBOL,
        },
        txHash: log.transactionHash,
        fromNetwork: ETH_CHAIN,
        toNetwork: FUEL_CHAIN,
        isDone:
          localStorage.getItem(`ethToFuelTx${log.transactionHash}-done`) ===
          'true',
      };
      return txDatum;
    });
  }, [logs]);

  return {
    txs,
  };
};
