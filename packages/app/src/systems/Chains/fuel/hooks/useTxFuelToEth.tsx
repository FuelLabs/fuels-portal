import { useBlock, useTransaction } from '@fuels-portal/sdk-react';
import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import { useEthAccountConnection } from '../../eth';
import type { TxFuelToEthMachineState } from '../machines';
import { txFuelToEthMachine } from '../machines';

import { useFuelAccountConnection } from './useFuelAccountConnection';

import { store } from '~/store';

const selectors = {
  status: (state: TxFuelToEthMachineState) => {
    const isSubmitToBridgeLoading = state.hasTag('isSubmitToBridgeLoading');
    const isSubmitToBridgeSelected = state.hasTag('isSubmitToBridgeSelected');
    const isSubmitToBridgeDone = state.hasTag('isSubmitToBridgeDone');
    const isSettlementLoading = state.hasTag('isSettlementLoading');
    const isSettlementSelected = state.hasTag('isSettlementSelected');
    const isSettlementDone = state.hasTag('isSettlementDone');
    const isConfirmTransactionSelected = state.hasTag(
      'isConfirmTransactionSelected'
    );
    const isConfirmTransactionLoading = state.hasTag(
      'isConfirmTransactionLoading'
    );
    const isConfirmTransactionDone = state.hasTag('isConfirmTransactionDone');
    const isWaitingEthWalletApproval = state.hasTag(
      'isWaitingEthWalletApproval'
    );
    const isReceiveDone = state.hasTag('isReceiveDone');

    return {
      isSubmitToBridgeLoading,
      isSubmitToBridgeSelected,
      isSubmitToBridgeDone,
      isSettlementLoading,
      isSettlementSelected,
      isSettlementDone,
      isConfirmTransactionSelected,
      isConfirmTransactionLoading,
      isConfirmTransactionDone,
      isWaitingEthWalletApproval,
      isReceiveDone,
    };
  },
  steps: (state: TxFuelToEthMachineState) => {
    const status = selectors.status(state);

    function getConfirmStatusText() {
      if (status.isWaitingEthWalletApproval) return 'Action Required';
      if (status.isConfirmTransactionDone) return 'Done!';
      return 'Action';
    }

    const steps = [
      {
        name: 'Submit to bridge',
        // TODO: put correct time left, how?
        status: status.isSubmitToBridgeDone ? 'Done!' : '~XX minutes left',
        isLoading: status.isSubmitToBridgeLoading,
        isSelected: status.isSubmitToBridgeSelected,
        isDone: status.isSubmitToBridgeDone,
      },
      {
        name: 'Settlement',
        // TODO: put correct time left, how? waiting for message Proof in this stage
        status: status.isSettlementDone ? 'Done!' : '~XX days left',
        isLoading: status.isSettlementLoading,
        isDone: status.isSettlementDone,
        isSelected: status.isSettlementSelected,
      },
      {
        name: 'Confirm transaction',
        status: getConfirmStatusText(),
        isLoading: status.isConfirmTransactionLoading,
        isDone: status.isConfirmTransactionDone,
        isSelected: status.isConfirmTransactionSelected,
      },
      {
        name: 'Receive on ETH',
        status: status.isReceiveDone ? 'Done!' : 'Automatic',
        isLoading: false,
        isDone: status.isReceiveDone,
        isSelected: false,
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

  const { txResponse: fuelTx } = useTransaction(txId);

  const cachedBlockDate = localStorage.getItem(
    `fuelBlockDate-${fuelTx?.receiptsRoot}`
  );
  const { block } = useBlock(
    !cachedBlockDate ? fuelTx?.receiptsRoot : undefined
  );

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
  }, [txId, fuelProvider, fuelTx]);

  useEffect(() => {
    if (block && block.time) {
      localStorage.setItem(`fuelBlockDate-${fuelTx?.receiptsRoot}`, block.time);
    }
  }, [block?.time]);

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
    fuelTx,
    fuelBlockDate: cachedBlockDate
      ? new Date(Number(cachedBlockDate))
      : block?.time
      ? new Date(Number(block?.time))
      : new Date(),
    steps,
    isWaitingEthWalletApproval: status.isWaitingEthWalletApproval,
  };
}
