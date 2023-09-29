import {
  BaseAssetId,
  ReceiptType,
  fromTai64ToUnix,
  getReceiptsMessageOut,
  hexlify,
} from 'fuels';
import { useMemo } from 'react';
import { VITE_ETH_ERC20, VITE_FUEL_FUNGIBLE_TOKEN_ID } from '~/config';
import { store, Services } from '~/store';
import type { BridgeAsset, BridgeTxsMachineState } from '~/systems/Bridge';

import { isSameEthAddress, parseFuelAddressToEth } from '../..';
import { useEthAccountConnection } from '../../eth/hooks';
import type { TxFuelToEthMachineState } from '../machines';
import { FUEL_ASSETS } from '../utils/assets';

const bridgeTxsSelectors = {
  txFuelToEth: (txId?: string) => (state: BridgeTxsMachineState) => {
    if (!txId) return undefined;

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
  asset: (state: TxFuelToEthMachineState): BridgeAsset => {
    const fuelTxResult = state.context.fuelTxResult;

    const messageOutReceipt = getReceiptsMessageOut(
      fuelTxResult?.receipts || []
    )[0];

    if (messageOutReceipt) {
      const burnReceipt = fuelTxResult?.receipts?.find(
        (receipt) => receipt.type === ReceiptType.Burn
      );
      if (burnReceipt) {
        const receipt = burnReceipt as Extract<
          typeof burnReceipt,
          { type: ReceiptType.Burn }
        >;
        const amount = receipt.val;
        const ethAssetId = messageOutReceipt.data
          ? parseFuelAddressToEth(
              hexlify(messageOutReceipt.data).replace('0x', '').slice(72, 136)
            )
          : undefined;

        if (isSameEthAddress(ethAssetId, VITE_ETH_ERC20)) {
          const asset = FUEL_ASSETS.find(
            (asset) => asset.address === VITE_FUEL_FUNGIBLE_TOKEN_ID
          );

          return {
            ...asset,
            amount: amount.format({
              precision: asset?.decimals,
            }),
          };
        }
      }
    }

    const asset = FUEL_ASSETS.find((asset) => asset.address === BaseAssetId);

    return {
      ...asset,
      amount: messageOutReceipt?.amount?.format({
        precision: asset?.decimals,
      }),
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
