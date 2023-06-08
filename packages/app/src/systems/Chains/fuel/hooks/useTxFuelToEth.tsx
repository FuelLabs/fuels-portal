import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import type { TxFuelToEthMachineState } from '../machines';
import { TxFuelToEthStatus, txFuelToEthMachine } from '../machines';

import { useFuelAccountConnection } from './useFuelAccountConnection';

import { store } from '~/store';

const selectors = {
  status: (state: TxFuelToEthMachineState) => {
    const { messageId, messageProof } = state.context;
    if (!messageId) return TxFuelToEthStatus.waitingFuelTransaction;
    if (!messageProof) return TxFuelToEthStatus.waitingSettlement;

    // TODO: add real condition waiting metamask approval
    if (true) {
      return TxFuelToEthStatus.waitingReceive;
    }

    return TxFuelToEthStatus.done;
  },
  steps: (state: TxFuelToEthMachineState) => {
    const status = selectors.status(state);

    const isWaitingFuelTransaction =
      status === TxFuelToEthStatus.waitingFuelTransaction;
    const isWaitingSettlement = status === TxFuelToEthStatus.waitingSettlement;
    const isWaitingReceive = status === TxFuelToEthStatus.waitingReceive;

    const isDone = status === TxFuelToEthStatus.done;
    const steps = [
      {
        name: 'Submit to bridge',
        // TODO: put correct time left, how?
        status: !isWaitingFuelTransaction ? 'Done!' : '~XX minutes left',
        isSelected: isWaitingFuelTransaction,
        isDone: !isWaitingFuelTransaction,
      },
      {
        name: 'Settlement',
        // TODO: put correct time left, how? waiting for message Proof in this stage
        status: !isWaitingSettlement ? 'Done!' : '~XX days left',
        isLoading: isWaitingSettlement,
        isDone: !isWaitingSettlement,
        isSelected: isWaitingSettlement,
      },
      {
        name: 'Confirm transaction',
        status: isDone ? 'Done!' : 'Automatic',
        // TODO: put correct loading here when have metamask approval part done
        isLoading: false,
        isDone,
        isSelected: false,
      },
      {
        name: 'Receive on ETH',
        status: isDone ? 'Done!' : 'Automatic',
        isLoading: false,
        isDone,
        isSelected: false,
      },
    ];
    return steps;
  },
};

export function useTxFuelToEth({ id }: { id: string }) {
  const { provider: fuelProvider } = useFuelAccountConnection();
  const service = useInterpret(txFuelToEthMachine);
  const steps = useSelector(service, selectors.steps);

  useEffect(() => {
    if (id && fuelProvider) {
      service.send('START_ANALYZE_TX', {
        input: {
          fuelTxId: id,
          fuelProvider,
        },
      });
    }
  }, [id, fuelProvider]);

  return {
    handlers: {
      close: store.closeOverlay,
    },
    steps,
  };
}
