import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useTransaction } from 'wagmi';

import { useFuelAccountConnection } from '../../fuel';
import type { TxEthToFuelMachineState } from '../machines';
import { TxEthToFuelStatus, txEthToFuelMachine } from '../machines';

import { useBlock } from './useBlock';
import { useEthAccountConnection } from './useEthAccountConnection';

import { store } from '~/store';

const selectors = {
  status: (state: TxEthToFuelMachineState) => {
    const { ethTxNonce, fuelMessage } = state.context;

    if (!ethTxNonce) return TxEthToFuelStatus.waitingSettlement;
    if (!fuelMessage) return TxEthToFuelStatus.waitingReceiveFuel;

    return TxEthToFuelStatus.done;
  },
  steps: (state: TxEthToFuelMachineState) => {
    const status = selectors.status(state);
    const { ethTx } = state.context;

    if (!ethTx) return undefined;

    const isWaitingSettlement = status === TxEthToFuelStatus.waitingSettlement;
    const isWaitingReceiveFuel =
      status === TxEthToFuelStatus.waitingReceiveFuel;
    const isDone = status === TxEthToFuelStatus.done;

    const steps = [
      {
        name: 'Submit to bridge',
        status: 'Done!',
        isDone: true,
      },
      {
        name: 'Settlement',
        status: !isWaitingSettlement ? 'Done!' : '~XX minutes left',
        isLoading: isWaitingSettlement,
        isDone: !isWaitingSettlement,
        isSelected: isWaitingSettlement,
      },
      {
        name: 'Confirm transaction',
        status: isDone ? 'Done!' : 'Automatic',
        isLoading: isWaitingReceiveFuel,
        isDone,
        isSelected: isWaitingReceiveFuel,
      },
      {
        name: 'Receive funds',
        status: isDone ? 'Done!' : 'Automatic',
        isLoading: false,
        isDone,
        isSelected: false,
      },
    ];

    return steps;
  },
};

export function useTxEthToFuel({ id }: { id: string }) {
  const { provider: ethProvider } = useEthAccountConnection();
  const { provider: fuelProvider, address: fuelAddress } =
    useFuelAccountConnection();
  const { data: ethTx } = useTransaction({
    hash: id.startsWith('0x') ? (id as `0x${string}`) : undefined,
  });
  const { age } = useBlock();
  const service = useInterpret(txEthToFuelMachine);
  const steps = useSelector(service, selectors.steps);
  useEffect(() => {
    if (ethTx && ethProvider && fuelProvider && fuelAddress) {
      service.send('START_ANALYZE_TX', {
        input: {
          ethTx,
          ethProvider,
          fuelProvider,
          fuelAddress,
        },
      });
    }
  }, [ethTx, ethProvider, fuelProvider, fuelAddress, service]);

  return {
    handlers: {
      close: store.closeOverlay,
    },
    ethTx,
    steps,
    age,
  };
}