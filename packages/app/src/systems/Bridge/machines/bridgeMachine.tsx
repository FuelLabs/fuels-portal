import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { FromToNetworks } from '../utils';

type MachineContext = {
  ethAddress?: string;
} & Partial<FromToNetworks>;

export enum BridgeStatus {
  waitingNetworkFrom = 'Select a network to bridge from',
  waitingNetworkTo = 'Select a network to bridge to',
  waitingConnectFrom = 'Connect From Wallet',
  waitingConnectTo = 'Connect To Wallet',
  waitingAsset = 'Pick asset to bridge',
  waitingAssetAmount = 'Type token amount to bridge',
  ready = 'Start transfer',
  waitingApproval = 'Waiting wallet approval',
}

export type BridgeMachineEvents = {
  type: 'CHANGE_NETWORKS';
  input: FromToNetworks;
};

export const bridgeMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./bridgeMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as BridgeMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          CHANGE_NETWORKS: {
            actions: ['assignNetworks'],
          },
        },
      },
    },
  },
  {
    actions: {
      assignNetworks: assign((ctx, ev) => ({
        ...ctx,
        fromNetwork: ev.input.fromNetwork,
        toNetwork: ev.input.toNetwork,
      })),
    },
  }
);

export type BridgeMachine = typeof bridgeMachine;
export type BridgeMachineService = InterpreterFrom<BridgeMachine>;
export type BridgeMachineState = StateFrom<BridgeMachine>;
