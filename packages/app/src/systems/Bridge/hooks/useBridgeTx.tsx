import { useInterpret, useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';
import { useSigner, useTransaction } from 'wagmi';

import type { TxEthToFuelMachineState } from '../machines';
import { txEthToFuelMachine } from '../machines';

import { store } from '~/store';

const selectors = {
  stepsTxEthToFuel: (state: TxEthToFuelMachineState) => {
    const { ethTx, ethTxReceipt, ethTxNonce, fuelMessage } = state.context;

    if (!ethTx) return undefined;

    const steps = [
      {
        name: 'Submit to bridge',
        status: 'Done!',
        isDone: true,
      },
      {
        name: 'Settlement',
        status: ethTxReceipt ? 'Done!' : '~XX minutes left',
        isLoading: !ethTxReceipt,
        isDone: Boolean(ethTxReceipt),
        isSelected: !ethTxReceipt,
      },
      {
        name: 'Confirm transaction',
        status: ethTxNonce ? 'Done!' : 'Automatic',
        isLoading: Boolean(ethTxReceipt && !ethTxNonce),
        isDone: Boolean(ethTxNonce),
        isSelected: Boolean(ethTxReceipt && !ethTxNonce),
      },
      {
        name: 'Receive funds',
        status: fuelMessage ? 'Done!' : 'Automatic',
        isLoading: Boolean(ethTxReceipt && ethTxNonce && !fuelMessage),
        isDone: Boolean(fuelMessage),
        isSelected: Boolean(ethTxReceipt && ethTxNonce && !fuelMessage),
      },
    ];

    return steps;
  },
};

export function useBridgeTx({ ethTxId }: { ethTxId: string }) {
  const {
    data: ethTx,
    isError,
    isLoading,
  } = useTransaction({
    hash: ethTxId.startsWith('0x') ? (ethTxId as `0x${string}`) : undefined,
  });
  const { data: ethSigner } = useSigner();
  const txEthToFuelService = useInterpret(txEthToFuelMachine);
  const stepsTxEthToFuel = useSelector(
    txEthToFuelService,
    selectors.stepsTxEthToFuel
  );
  const steps = useMemo(() => {
    if (stepsTxEthToFuel?.length) return stepsTxEthToFuel;

    return undefined;
  }, [stepsTxEthToFuel]);

  useEffect(() => {
    if (ethTx && ethSigner) {
      txEthToFuelService.send('START_ANALYZE_TX', {
        input: {
          ethTx,
          ethProvider: ethSigner.provider,
        },
      });
    }
  }, [ethTx, ethSigner]);

  return {
    handlers: {
      close: store.closeOverlay,
    },
    ethTx,
    steps,
  };
}
