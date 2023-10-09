import { useQuery } from '@tanstack/react-query';
import { addSeconds, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import { EthConnectorService } from '~/systems/Chains';

export function useWithdrawDelay() {
  const publicClient = usePublicClient();
  const fuelChainState = useMemo(() => {
    return EthConnectorService.connectToFuelChainState({
      publicClient,
    });
  }, [publicClient]);

  const { data, ...params } = useQuery({
    queryFn: async () => {
      const [blockPerCommitInterval, timeToFinalize] = (await Promise.all([
        fuelChainState.read.BLOCKS_PER_COMMIT_INTERVAL(),
        fuelChainState.read.TIME_TO_FINALIZE(),
      ])) as [bigint, bigint];
      // It's safe to conver bigint to number in this case as the values of
      // blockPerCommitInterval and timeToFinalize are not too big.
      const totalTimeInSeconds =
        Number(blockPerCommitInterval) + Number(timeToFinalize);
      const currentDate = new Date();
      const futureDate = addSeconds(currentDate, totalTimeInSeconds);

      return {
        timeToWithdrawFormatted: formatDistanceToNow(futureDate, {
          addSuffix: false,
        }),
        timeToWithdrawSeconds: totalTimeInSeconds,
      };
    },
  });

  return {
    ...data,
    ...params,
  };
}
