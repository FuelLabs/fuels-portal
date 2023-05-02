import { useTransaction } from 'wagmi';

import { store } from '~/store';

export function useBridgeTx({ ethTxId }: { ethTxId: string }) {
  const {
    data: ethTx,
    isError,
    isLoading,
  } = useTransaction({
    hash: ethTxId.startsWith('0x') ? (ethTxId as `0x${string}`) : undefined,
  });

  // TODO: send ethTx to bridgeTx machine

  return {
    handlers: {
      close: store.closeOverlay,
    },
    ethTx,
  };
}
