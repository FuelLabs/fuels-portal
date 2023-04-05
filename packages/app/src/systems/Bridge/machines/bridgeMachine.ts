import { JsonRpcSigner } from '@ethersproject/providers';
import { FuelWalletLocked } from '@fuel-wallet/sdk';
import { BN, TransactionResult, bn } from 'fuels';
import { createMachine, InterpreterFrom } from 'xstate';
import { Maybe } from '~/types';

import { FuelMessagePortal__factory } from '~/types/fuel-v2-contracts/factories/FuelMessagePortal__factory';

import { txFeedback, handleError } from '../../Core/utils/feedback';

export type BridgeContext = {
  fromWallet: JsonRpcSigner;
  toWallet: FuelWalletLocked | false;
  coinFromBalance: BN;
  gasTokenFromBalance: BN;
  depositAmount: string;
};

const depositTokens = async (ctx: BridgeContext) => {
  const {
    fromWallet,
    toWallet,
    coinFromBalance,
    gasTokenFromBalance,
    depositAmount,
  } = ctx;

  if (!fromWallet) {
    throw new Error('From Wallet not connected!');
  }

  if (!toWallet) {
    throw new Error('To Wallet not connected!');
  }

  const fuelPortal = FuelMessagePortal__factory.connect(
    process.env.VITE_FUEL_MESSAGE_PORTAL!,
    fromWallet
  );

  // Parse 18 units of ETH
  // TODO fix
  const value = bn.parseUnits(depositAmount, 9).toHex();
  const tx = await fuelPortal.depositETH(toWallet.address.toHexString(), {
    value,
  });
  const result = await tx.wait();
  return result;
};

export type BridgeEvents = { type: 'DEPOSIT' };

type BridgeServices = {
  swap: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Maybe<TransactionResult<any>>;
  };
};

export const bridgeMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./bridgeMachine.typegen').Typegen0,
    predictableActionArguments: true,
    schema: {
      context: {} as BridgeContext,
      events: {} as BridgeEvents,
      services: {} as BridgeServices,
    },
    id: 'bridgeMachine',
    initial: 'idle',
    states: {
      idle: {
        on: {
          DEPOSIT: { target: 'depositing' },
        },
      },
      depositing: {
        invoke: {
          src: 'deposit',
          onDone: [{ target: 'success' }],
          onError: [{ actions: 'toastErrorMessage' }],
        },
      },
      success: {
        entry: ['clearContext', 'toastDepositSuccess'],
      },
    },
  },
  {
    services: {
      deposit: async (ctx) => {
        return depositTokens(ctx);
      },
    },
    actions: {
      /**
       * Notifications actions using toast()
       */
      toastDepositSuccess(_, ev) {
        txFeedback('Deposit made successfully!')(ev.data);
      },
      toastErrorMessage(_, ev) {
        handleError(ev.data);
        // eslint-disable-next-line no-console
        console.error(ev.data);
      },
    },
  }
);

export type BridgeMachine = typeof bridgeMachine;
export type BridgeMachineService = InterpreterFrom<BridgeMachine>;
