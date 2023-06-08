import type { Provider as FuelProvider, MessageProof } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { TxFuelToEthInputs } from '../services';
import { TxFuelToEthService } from '../services';

import { FetchMachine } from '~/systems/Core/machines';

type MachineContext = {
  fuelProvider: FuelProvider;
  fuelTxId: string;
  messageId?: string;
  messageProof?: MessageProof;
};

type MachineServices = {
  getMessageId: {
    data?: string;
  };
  getMessageProof: {
    data?: MessageProof | null;
  };
  relayMessageFromFuelBlock: {
    data?: any;
  };
};

export enum TxFuelToEthStatus {
  waitingFuelTransaction = 'Waiting Fuel Transaction',
  waitingSettlement = 'Waiting Settlement',
  waitingReceive = 'Waiting Receive on ETH',
  done = 'Done',
}

type AnalyzeInputs = TxFuelToEthInputs['getMessageProof'];
export type TxFuelToEthMachineEvents = {
  type: 'START_ANALYZE_TX';
  input: AnalyzeInputs;
};

export const txFuelToEthMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txFuelToEthMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as TxFuelToEthMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_ANALYZE_TX: {
            actions: ['assignAnalyzeTxInput'],
            target: 'gettingMessageId',
          },
        },
      },
      gettingMessageId: {
        invoke: {
          src: 'getMessageId',
          data: {
            input: (ctx: MachineContext) => ({
              fuelTxId: ctx.fuelTxId,
              fuelProvider: ctx.fuelProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
            },
            {
              actions: ['assignMessageId'],
              cond: 'hasMessageId',
              target: 'checkingMessageProof',
            },
          ],
        },
        after: {
          10000: {
            target: 'gettingMessageId',
          },
        },
      },
      checkingMessageProof: {
        invoke: {
          src: 'getMessageProof',
          data: {
            input: (ctx: MachineContext) => ({
              fuelTxId: ctx.fuelTxId,
              messageId: ctx.messageId,
              fuelProvider: ctx.fuelProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'idle',
            },
            {
              actions: ['assignMessageProof'],
              cond: 'hasMessageProof',
              // TODO: create next state for continuing the flow
              // target: 'checkingFuelTx',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingMessageProof',
          },
        },
      },
      done: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {
      assignAnalyzeTxInput: assign((_, ev) => ({
        fuelTxId: ev.input.fuelTxId,
        fuelProvider: ev.input.fuelProvider,
      })),
      assignMessageId: assign({
        messageId: (_, ev) => ev.data || undefined,
      }),
      assignMessageProof: assign({
        messageProof: (_, ev) => ev.data || undefined,
      }),
    },
    guards: {
      hasMessageId: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
      hasMessageProof: (ctx, ev) => !!ctx.messageProof || !!ev?.data,
    },
    services: {
      getMessageId: FetchMachine.create<
        TxFuelToEthInputs['getMessageId'],
        MachineServices['getMessageId']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          return TxFuelToEthService.getMessageId(input);
        },
      }),
      getMessageProof: FetchMachine.create<
        TxFuelToEthInputs['getMessageProof'],
        MachineServices['getMessageProof']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          return TxFuelToEthService.getMessageProof(input);
        },
      }),
      relayMessageFromFuelBlock: FetchMachine.create<
        TxFuelToEthInputs['relayMessageFromFuelBlock'],
        MachineServices['relayMessageFromFuelBlock']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input) {
            throw new Error('No input to get fuel message');
          }

          return TxFuelToEthService.relayMessageFromFuelBlock(input);
        },
      }),
    },
  }
);

export type TxFuelToEthMachine = typeof txFuelToEthMachine;
export type TxFuelToEthMachineService = InterpreterFrom<TxFuelToEthMachine>;
export type TxFuelToEthMachineState = StateFrom<TxFuelToEthMachine>;
