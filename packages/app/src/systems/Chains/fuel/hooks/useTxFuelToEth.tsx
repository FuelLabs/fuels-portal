import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import { useEthAccountConnection } from '../../eth';
import type { TxFuelToEthMachineState } from '../machines';
import { TxFuelToEthStatus, txFuelToEthMachine } from '../machines';

import { useFuelAccountConnection } from './useFuelAccountConnection';

import { store } from '~/store';

const selectors = {
  status: (state: TxFuelToEthMachineState) => {
    const { messageId, messageProof } = state.context;
    if (!messageId) return TxFuelToEthStatus.waitingFuelTransaction;
    if (!messageProof) return TxFuelToEthStatus.waitingSettlement;
    if (
      state.matches('waitingEthWalletApproval') ||
      state.matches('relayingMessageFromFuelBlock')
    ) {
      return TxFuelToEthStatus.waitingEthWalletApproval;
    }

    if (state.matches('waitingReceive')) {
      return TxFuelToEthStatus.waitingReceive;
    }

    return TxFuelToEthStatus.done;
  },
  steps: (state: TxFuelToEthMachineState) => {
    const status = selectors.status(state);

    const isWaitingFuelTransaction =
      status === TxFuelToEthStatus.waitingFuelTransaction;
    const isWaitingSettlement = status === TxFuelToEthStatus.waitingSettlement;
    const isWaitingEthWalletApproval =
      status === TxFuelToEthStatus.waitingEthWalletApproval;
    const isWaitingReceive = status === TxFuelToEthStatus.waitingReceive;

    const isDone = status === TxFuelToEthStatus.done;

    function getConfirmStatusText() {
      if (isWaitingEthWalletApproval) return 'Action Required';
      if (isWaitingReceive) return 'Done!';
      return 'Action';
    }

    // should refactor machine substates with tags 'submitDone', 'settlementDone', 'confirmDone', 'receiveDone', 'submitLoading' ..... etc
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
        status: getConfirmStatusText(),
        isLoading: false,
        isDone: isWaitingReceive || isDone,
        isSelected: isWaitingEthWalletApproval,
      },
      {
        name: 'Receive on ETH',
        status: isDone ? 'Done!' : 'Automatic',
        isLoading: isWaitingReceive,
        isDone,
        isSelected: isWaitingReceive,
      },
    ];
    return steps;
  },
};

export function useTxFuelToEth({ txId }: { txId: string }) {
  const { walletClient: ethWalletClient, publicClient: ethPublicClient } =
    useEthAccountConnection();
  const { provider: fuelProvider } = useFuelAccountConnection();
  const service = useInterpret(txFuelToEthMachine);
  const status = useSelector(service, selectors.status);
  const steps = useSelector(service, selectors.steps);

  useEffect(() => {
    if (txId && fuelProvider) {
      service.send('START_ANALYZE_TX', {
        input: {
          fuelTxId: txId,
          fuelProvider,
          ethPublicClient,
        },
      });
    }
  }, [txId, fuelProvider]);

  function relayToEth() {
    service.send('RELAY_TO_ETH', {
      input: {
        ethWalletClient,
      },
    });
  }

  return {
    handlers: {
      close: store.closeOverlay,
      relayToEth,
    },
    steps,
    isWaitingEthWalletApproval:
      status === TxFuelToEthStatus.waitingEthWalletApproval,
  };
}
