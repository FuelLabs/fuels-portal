import type {
  Provider as EthProvider,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/providers';
import type { BN, Message, WalletUnlocked } from 'fuels';
import { bn, Provider as FuelProvider, Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { FuelMessagePortal__factory } from '../services/fuel-v2-contracts/factories/FuelMessagePortal__factory';

import { FetchMachine } from '~/systems/Core';

type MachineContext = {
  ethTx?: TransactionResponse;
  ethTxReceipt?: TransactionReceipt;
  ethTxNonce?: BN;
  ethProvider?: EthProvider;
  fuelMessage?: Message;
};

type MachineServices = {
  getEthReceipts: {
    data: { txReceipt: TransactionReceipt; txNonce: BN };
  };
  getFuelMessage: {
    data: Message | undefined;
  };
};

export type TxEthToFuelMachineEvents = {
  type: 'START_ANALYZE_TX';
  input: { ethTx: TransactionResponse; ethProvider: EthProvider };
};

export const txEthToFuelMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txEthToFuelMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as TxEthToFuelMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_ANALYZE_TX: {
            actions: ['assignEthTx', 'assignEthProvider'],
            target: 'checkingSettlement',
          },
        },
      },
      checkingSettlement: {
        invoke: {
          src: 'getEthReceipts',
          data: {
            input: (ctx: MachineContext) => ({
              ethTx: ctx.ethTx,
              ethProvider: ctx.ethProvider,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'checkingSettlement',
            },
            {
              actions: ['assignEthTxReceipt', 'assignEthTxNonce'],
              cond: 'hasEthTxNonce',
              target: 'checkingFuelTx',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingSettlement',
          },
        },
      },
      checkingFuelTx: {
        invoke: {
          src: 'getFuelMessage',
          data: {
            input: (ctx: MachineContext) => ({
              ethTxNonce: ctx.ethTxNonce,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignFuelMessage'],
              cond: 'hasFuelMessage',
              target: 'bridged',
            },
          ],
        },
        after: {
          10000: {
            target: 'checkingFuelTx',
          },
        },
      },
      bridged: {
        type: 'final',
      },
      failed: {},
    },
  },
  {
    actions: {
      assignEthTx: assign({
        ethTx: (_, ev) => ev.input.ethTx,
      }),
      assignEthTxReceipt: assign({
        ethTxReceipt: (_, ev) => ev.data.txReceipt,
      }),
      assignEthProvider: assign({
        ethProvider: (_, ev) => ev.input.ethProvider,
      }),
      assignEthTxNonce: assign({
        ethTxNonce: (_, ev) => ev.data.txNonce,
      }),
      assignFuelMessage: assign({
        fuelMessage: (_, ev) => ev.data,
      }),
    },
    guards: {
      hasFuelMessage: (ctx, ev) => !!ctx.fuelMessage || !!ev?.data,
      hasEthTxNonce: (ctx, ev) => !!ctx.ethTxNonce || !!ev?.data?.txNonce,
    },
    services: {
      getEthReceipts: FetchMachine.create<
        { ethTx: TransactionResponse; ethProvider: EthProvider },
        MachineServices['getEthReceipts']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.ethTx) {
            throw new Error('No eth TX');
          }

          const { ethTx, ethProvider } = input;

          const receipt = await ethTx.wait();

          const fuelPortal = FuelMessagePortal__factory.connect(
            '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
            // response.FuelMessagePortal,
            ethProvider
          );
          const event = fuelPortal.interface.parseLog(receipt.logs[0]);
          const depositMessageNonce = bn(event.args.nonce.toHexString());

          return { txReceipt: receipt, txNonce: depositMessageNonce };
        },
      }),
      getFuelMessage: FetchMachine.create<
        { ethTxNonce: BN },
        MachineServices['getFuelMessage']['data']
      >({
        showError: true,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.ethTxNonce) {
            throw new Error('No nonce informed');
          }

          const { ethTxNonce } = input;

          const fuelProvider = new FuelProvider(
            'http://localhost:4000/graphql'
          );
          const fuelWallet: WalletUnlocked = Wallet.fromPrivateKey(
            '0x6303bacbe42085ab84211bba63f4946649bcfb81c30510cad46e6e4efbccbd72',
            fuelProvider
          );
          const messages = await fuelProvider.getMessages(fuelWallet.address, {
            first: 1000,
          });
          const message = messages.find((message) => {
            return message.nonce.toHex() === ethTxNonce.toHex();
          });

          if (message) {
            return message;
          }

          return undefined;
        },
      }),
    },
  }
);

export type TxEthToFuelMachine = typeof txEthToFuelMachine;
export type TxEthToFuelMachineService = InterpreterFrom<TxEthToFuelMachine>;
export type TxEthToFuelMachineState = StateFrom<TxEthToFuelMachine>;
