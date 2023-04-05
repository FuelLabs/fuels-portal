import { createContext, ReactNode } from 'react';
import { useInterpret } from '@xstate/react';
import {
  bridgeMachine,
  BridgeMachineService,
  BridgeContext,
} from '../machines/bridgeMachine';
import { useWallet } from '~/systems/Core';
import { useNonFuelSigner } from '~/systems/Core/hooks/useNonFuelSigner';

const bridgeContext = createContext<BridgeMachineService>(
  // @ts-ignore
  null as BridgeMachineService
);

type BridgeProviderProps = {
  children: ReactNode;
};

export const BridgeProvider = ({ children }: BridgeProviderProps) => {
  const fromWallet = useNonFuelSigner();
  const toWallet = useWallet();
  const bridgeService = useInterpret(bridgeMachine, {
    context: {
      fromWallet,
      toWallet: toWallet.data,
    } as BridgeContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return (
    <bridgeContext.Provider value={bridgeService}>
      {children}
    </bridgeContext.Provider>
  );
};
