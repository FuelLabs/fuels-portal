import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useTransaction } from 'wagmi';

import { useFuelAccountConnection } from '../../fuel';
import type { TxEthToFuelMachineState } from '../machines';
import { txEthToFuelMachine } from '../machines';
import { isErc20Address } from '../utils';

import { useBlocks } from './useBlocks';
import { useCachedBlocksDates } from './useCachedBlocksDates';
import { useEthAccountConnection } from './useEthAccountConnection';

import { store } from '~/store';

const selectors = {
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
    const isWaitingFuelWalletApproval = state.hasTag(
      'isWaitingFuelWalletApproval'
    );

    return {
      isSettlementLoading,
      isSettlementSelected,
      isSettlementDone,
      isConfirmTransactionLoading,
      isConfirmTransactionSelected,
      isReceiveDone,
      isWaitingFuelWalletApproval,
    };
  },
  steps: (state: TxEthToFuelMachineState) => {
    const status = selectors.status(state);
    const { ethTx, erc20Token } = state.context;

    if (!ethTx) return undefined;

    const confirmTransactionText = isErc20Address(erc20Token?.address)
      ? 'Action'
      : 'Automatic';

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
        status: status.isReceiveDone ? 'Done!' : confirmTransactionText,
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
  ercToken: (state: TxEthToFuelMachineState) => {
    const { erc20Token } = state.context;
    return erc20Token;
  },
};

export function useTxEthToFuel({
  id,
  skipAnalyzeTx,
}: {
  id: string;
  skipAnalyzeTx?: boolean;
}) {
  const { publicClient: ethPublicClient } = useEthAccountConnection();
  const {
    provider: fuelProvider,
    address: fuelAddress,
    wallet: fuelWallet,
  } = useFuelAccountConnection();
  const { data: ethTx } = useTransaction({
    hash: id.startsWith('0x') ? (id as `0x${string}`) : undefined,
  });

  const { blockDates, notCachedHashes } = useCachedBlocksDates(
    ethTx?.blockHash ? [ethTx?.blockHash] : undefined
  );
  const { blocks } = useBlocks(notCachedHashes);
  const service = useInterpret(txEthToFuelMachine);
  const steps = useSelector(service, selectors.steps);
  const status = useSelector(service, selectors.status);
  const erc20Token = useSelector(service, selectors.ercToken);

  useEffect(() => {
    if (
      ethTx &&
      fuelProvider &&
      fuelAddress &&
      !skipAnalyzeTx &&
      ethPublicClient
    ) {
      service.send('START_ANALYZE_TX', {
        input: {
          ethTx,
          fuelProvider,
          fuelAddress,
          ethPublicClient,
        },
      });
    }
  }, [
    ethTx,
    fuelProvider,
    fuelAddress,
    service,
    ethPublicClient,
    skipAnalyzeTx,
  ]);

  function relayMessageToFuel() {
    service.send('RELAY_MESSAGE_ON_FUEL', {
      input: {
        fuelWallet,
      },
    });
  }

  const ethBlockDate = ethTx?.blockHash
    ? blockDates?.[ethTx.blockHash] ||
      blocks?.find((block) => block.hash === ethTx.blockHash)?.date
    : undefined;
  const shouldShowConfirmButton =
    isErc20Address(erc20Token?.address) &&
    (status.isWaitingFuelWalletApproval || status.isConfirmTransactionLoading);

  return {
    handlers: {
      close: store.closeOverlay,
      openTxEthToFuel: store.openTxEthToFuel,
      relayMessageToFuel,
    },
    ethTx,
    ethBlockDate,
    steps,
    status,
    shouldShowConfirmButton,
  };
}
