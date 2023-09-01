import { useInterpret, useSelector } from '@xstate/react';

import type { TxEthToFuelMachineState } from '../machines';
import { txEthToFuelMachine } from '../machines';
import { ETH_SYMBOL, ethLogoSrc } from '../utils';

import { Services, store } from '~/store';
import type { BridgeTxsMachineState } from '~/systems/Bridge';

const bridgeTxsSelectors = {
  txEthToFuel: (txId?: `0x${string}`) => (state: BridgeTxsMachineState) => {
    if (!txId) return undefined;

    const machine = state.context?.ethToFuelTxRefs?.[txId];

    return machine;
  },
};

const txEthToFuelSelectors = {
  status: (state: TxEthToFuelMachineState) => {
    const isSettlementLoading = state.hasTag('isSettlementLoading');
    const isSettlementSelected = state.hasTag('isSettlementSelected');
    const isSettlementDone = state.hasTag('isSettlementDone');
    const isConfirmTransactionLoading = state.hasTag(
      'isConfirmTransactionLoading'
    );
    const isConfirmTransactionSelected = state.hasTag(
      'isConfirmTransactionSelected'
    );
    const isReceiveDone = state.hasTag('isReceiveDone');

    return {
      isSettlementLoading,
      isSettlementSelected,
      isSettlementDone,
      isConfirmTransactionLoading,
      isConfirmTransactionSelected,
      isReceiveDone,
    };
  },
  steps: (state: TxEthToFuelMachineState) => {
    const status = txEthToFuelSelectors.status(state);
    const { ethTxId } = state.context;

    if (!ethTxId) return undefined;

    const steps = [
      {
        name: 'Submit to bridge',
        status: 'Done!',
        isDone: true,
      },
      {
        name: 'Settlement',
        // TODO: put correct time left '~XX minutes left', how?
        status: status.isSettlementDone ? 'Done!' : 'Waiting',
        isLoading: status.isSettlementLoading,
        isDone: status.isSettlementDone,
        isSelected: status.isSettlementSelected,
      },
      {
        name: 'Confirm transaction',
        status: status.isReceiveDone ? 'Done!' : 'Automatic',
        isLoading: status.isConfirmTransactionLoading,
        isDone: status.isReceiveDone,
        isSelected: status.isConfirmTransactionSelected,
      },
      {
        name: 'Receive on Fuel',
        status: status.isReceiveDone ? 'Done!' : 'Automatic',
        isLoading: false,
        isDone: status.isReceiveDone,
        isSelected: false,
      },
    ];

    return steps;
  },
  amount: (state: TxEthToFuelMachineState) => {
    const { amount } = state.context;

    return amount;
  },
  blockDate: (state: TxEthToFuelMachineState) => {
    const { blockDate } = state.context;

    return blockDate;
  },
  asset: (state: TxEthToFuelMachineState) => {
    return {
      assetAmount: state.context.amount,
      assetImageSrc: ethLogoSrc,
      assetSymbol: ETH_SYMBOL,
    };
  },
};

export function useTxEthToFuel({ id }: { id: string }) {
  const txId = id.startsWith('0x') ? (id as `0x${string}`) : undefined;
  const fallbackMachine = useInterpret(txEthToFuelMachine);

  const txEthToFuel = store.useSelector(
    Services.bridgeTxs,
    bridgeTxsSelectors.txEthToFuel(txId)
  );
  const steps = useSelector(
    txEthToFuel || fallbackMachine,
    txEthToFuelSelectors.steps
  );
  const status = useSelector(
    txEthToFuel || fallbackMachine,
    txEthToFuelSelectors.status
  );
  const amount = useSelector(
    txEthToFuel || fallbackMachine,
    txEthToFuelSelectors.amount
  );
  const date = useSelector(
    txEthToFuel || fallbackMachine,
    txEthToFuelSelectors.blockDate
  );
  const asset = useSelector(
    txEthToFuel || fallbackMachine,
    txEthToFuelSelectors.asset
  );

  return {
    handlers: {
      close: store.closeOverlay,
      openTxEthToFuel: store.openTxEthToFuel,
    },
    date,
    steps,
    status,
    amount,
    asset,
  };
}
