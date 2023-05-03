import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { BridgeInputs } from '../services';
import { BridgeService } from '../services';
import type { FromToNetworks } from '../utils';
import { isEthChain, isFuelChain } from '../utils';

import { store } from '~/store';
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
      input: BridgeInputs['bridge'];
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
              actions: ['openBridgeTxDialog'],
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
      openBridgeTxDialog: (_, ev) => {
        store.openBridgeTx({
          ethTxId: ev.data,
        });
      },
    },
    services: {
      bridge: FetchMachine.create<
        BridgeInputs['bridge'] & FromToNetworks,
        MachineServices['bridge']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to bridge');
          }

          const { fromNetwork, toNetwork, amount, ethSigner } = input;

          if (!fromNetwork || !toNetwork) {
            throw new Error('"Network From" and "Network To" are required');
          }

          if (!amount || amount.isZero()) {
            throw new Error('Need to inform asset amount to be transfered');
          }

          if (isEthChain(fromNetwork) && isFuelChain(toNetwork)) {
            const ethTxHash = await BridgeService.bridgeEthToFuel({
              amount,
              ethSigner,
            });

            return ethTxHash;
          }

          throw new Error('Bridge between this networks is not supported');
        },
      }),
    },
  }
);

export type BridgeMachine = typeof bridgeMachine;
export type BridgeMachineService = InterpreterFrom<BridgeMachine>;
export type BridgeMachineState = StateFrom<BridgeMachine>;
