import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useSigner, useTransaction } from 'wagmi';

import type { TxEthToFuelMachineState } from '../machines';
import { txEthToFuelMachine } from '../machines';

import { store } from '~/store';

const selectors = {
  status:
    ({
      ethAddress,
      fuelAddress,
    }: {
      ethAddress?: string;
      fuelAddress?: string;
    }) =>
    (state: TxEthToFuelMachineState) => {
      const { ethTx, ethTxReceipt, ethTxNonce, fuelMessage } = state.context;

      if (!ethTxReceipt) {
      }

      if (!fromNetwork) return BridgeStatus.waitingNetworkFrom;
      if (!toNetwork) return BridgeStatus.waitingNetworkTo;
      if (
        (isEthChain(fromNetwork) && !ethAddress) ||
        (isFuelChain(fromNetwork) && !fuelAddress)
      )
        return BridgeStatus.waitingConnectFrom;
      if (
        (isEthChain(toNetwork) && !ethAddress) ||
        (isFuelChain(toNetwork) && !fuelAddress)
      )
        return BridgeStatus.waitingConnectTo;

      return BridgeStatus.waitingAsset;
    },
  steps: (state: TxEthToFuelMachineState) => {
    const { ethTx, ethTxReceipt, ethTxNonce, fuelMessage } = state.context;

    if (!ethTx) return undefined;

    // TODO: refact this and craete status for TxEthToFuel.. just like useBrigde
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

export function useTxEthToFuel({ id }: { id: string }) {
  const {
    data: ethTx,
    isError,
    isLoading,
  } = useTransaction({
    hash: id.startsWith('0x') ? (id as `0x${string}`) : undefined,
  });
  const { data: ethSigner } = useSigner();
  const service = useInterpret(txEthToFuelMachine);
  const steps = useSelector(service, selectors.steps);

  useEffect(() => {
    if (ethTx && ethSigner) {
      service.send('START_ANALYZE_TX', {
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
