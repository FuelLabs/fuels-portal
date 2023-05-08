import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { BridgeInputs, PossibleBridgeInputs } from '../services';
import { BridgeService } from '../services';
import type { FromToNetworks } from '../utils';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  ethAddress?: string;
} & Partial<FromToNetworks>;

type MachineServices = {
  bridge: {
    data: string;
  };
};

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

export type BridgeMachineEvents =
  | {
      type: 'CHANGE_NETWORKS';
      input: FromToNetworks;
    }
  | {
      type: 'START_BRIDGING';
      input: PossibleBridgeInputs;
    };

export const bridgeMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./bridgeMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
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
          START_BRIDGING: {
            target: 'bridging',
          },
        },
      },
      bridging: {
        invoke: {
          src: 'bridge',
          data: {
            input: (
              ctx: MachineContext,
              ev: Extract<BridgeMachineEvents, { type: 'START_BRIDGING' }>
            ) => ({
              fromNetwork: ctx.fromNetwork,
              toNetwork: ctx.toNetwork,
              amount: ev.input.amount,
              ethSigner: ev.input.ethSigner,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      failed: {},
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
    services: {
      bridge: FetchMachine.create<BridgeInputs['bridge'], void>({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to bridge');
          }

          await BridgeService.bridge(input);
        },
      }),
    },
  }
);

export type BridgeMachine = typeof bridgeMachine;
export type BridgeMachineService = InterpreterFrom<BridgeMachine>;
export type BridgeMachineState = StateFrom<BridgeMachine>;
