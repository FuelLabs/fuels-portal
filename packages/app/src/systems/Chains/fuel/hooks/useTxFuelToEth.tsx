import { fromTai64ToUnix, getReceiptsMessageOut } from 'fuels';
import { useMemo } from 'react';
import { store, Services } from '~/store';
import type { BridgeTxsMachineState } from '~/systems/Bridge';

import { useEthAccountConnection } from '../../eth/hooks';
import { ETH_SYMBOL } from '../../eth/utils/chain';
import { ethLogoSrc } from '../../eth/utils/logo';
import type { TxFuelToEthMachineState } from '../machines';

const bridgeTxsSelectors = {
  txFuelToEth: (txId?: string) => (state: BridgeTxsMachineState) => {
    if (!txId) return undefined;

    // if (!state.context?.fuelToEthTxRefs) {
    //   debugger;
    // }

    const machine = state.context?.fuelToEthTxRefs?.[txId]?.getSnapshot();

    return machine;
  },
};

const txFuelToEthSelectors = {
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
    const isReceiveLoading = state.hasTag('isReceiveLoading');
    const isReceiveSelected = state.hasTag('isReceiveSelected');
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
      isReceiveLoading,
      isReceiveSelected,
      isReceiveDone,
    };
  },
  steps: (state: TxFuelToEthMachineState) => {
    const status = txFuelToEthSelectors.status(state);

    function getConfirmStatusText() {
      if (status.isWaitingEthWalletApproval) return 'Action required';
      if (status.isConfirmTransactionDone) return 'Done!';
      return 'Action';
    }

    const steps = [
      {
        name: 'Submit to bridge',
        // TODO: put correct time left '~XX minutes left', how?
        status: status.isSubmitToBridgeDone ? 'Done!' : 'Waiting',
        isLoading: status.isSubmitToBridgeLoading,
        isSelected: status.isSubmitToBridgeSelected,
        isDone: status.isSubmitToBridgeDone,
      },
      {
        name: 'Settlement',
        // TODO: put correct time left '~XX days left', how? waiting for message Proof in this stage
        status: status.isSettlementDone ? 'Done!' : 'Waiting',
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
        isLoading: status.isReceiveLoading,
        isDone: status.isReceiveDone,
        isSelected: status.isReceiveSelected,
      },
    ];
    return steps;
  },
  fuelTxResult: (state: TxFuelToEthMachineState) => {
    const fuelTxResult = state.context.fuelTxResult;
    return fuelTxResult;
  },
  asset: (state: TxFuelToEthMachineState) => {
    const fuelTxResult = state.context.fuelTxResult;

    const messageOutReceipt = getReceiptsMessageOut(
      fuelTxResult?.receipts || []
    )[0];

    const amountSent = messageOutReceipt?.amount;

    return {
      assetAmount: amountSent?.format({
        precision: 9,
      }),
      assetImageSrc: ethLogoSrc,
      assetSymbol: ETH_SYMBOL,
    };
  },
};

export function useTxFuelToEth({ txId }: { txId: string }) {
  const { walletClient: ethWalletClient } = useEthAccountConnection();

  const txFuelToEthState = store.useSelector(
    Services.bridgeTxs,
    bridgeTxsSelectors.txFuelToEth(txId)
  );

  const { steps, status, fuelTxResult, asset } = useMemo(() => {
    if (!txFuelToEthState) return {};

    const steps = txFuelToEthSelectors.steps(txFuelToEthState);
    const status = txFuelToEthSelectors.status(txFuelToEthState);
    const fuelTxResult = txFuelToEthSelectors.fuelTxResult(txFuelToEthState);
    const asset = txFuelToEthSelectors.asset(txFuelToEthState);

    return {
      steps,
      status,
      fuelTxResult,
      asset,
    };
  }, [txFuelToEthState]);

  // TODO: remove this conversion when sdk already returns the date in unix format
  const date = useMemo(
    () =>
      fuelTxResult?.time
        ? new Date(fromTai64ToUnix(fuelTxResult?.time) * 1000)
        : undefined,
    [fuelTxResult?.time]
  );

  function relayToEth() {
    if (!ethWalletClient) return;

    store.relayTxFuelToEth({
      input: {
        ethWalletClient,
      },
      fuelTxId: txId,
    });
  }

  return {
    handlers: {
      close: store.closeOverlay,
      relayToEth,
      openTxFuelToEth: store.openTxFuelToEth,
    },
    fuelTxResult,
    date,
    asset,
    steps,
    status,
  };
}
