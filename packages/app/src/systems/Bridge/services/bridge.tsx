import { bn, DECIMAL_UNITS, fromTai64ToUnix } from 'fuels';
import type {
  Address as FuelAddress,
  BN,
  Provider as FuelProvider,
} from 'fuels';
import type { PublicClient, WalletClient } from 'wagmi';
import { store } from '~/store';
import type {
  FromToNetworks,
  TxEthToFuelInputs,
  TxFuelToEthInputs,
} from '~/systems/Chains';
import {
  TxFuelToEthService,
  isEthChain,
  isFuelChain,
  TxEthToFuelService,
  getBlockDate,
  ETH_CHAIN,
  FUEL_CHAIN,
} from '~/systems/Chains';

import type { BridgeAsset, BridgeTx } from '../types';

export type PossibleBridgeInputs = {
  assetAmount?: BN;
  ethWalletClient?: WalletClient;
  ethPublicClient?: PublicClient;
  fuelAddress?: FuelAddress;
  ethAsset?: BridgeAsset;
  fuelAsset?: BridgeAsset;
} & Omit<TxEthToFuelInputs['start'], 'amount'> &
  Omit<TxFuelToEthInputs['create'], 'amount'>;
export type BridgeInputs = {
  bridge: FromToNetworks & PossibleBridgeInputs;
  fetchTxs: {
    fuelProvider?: FuelProvider;
    ethPublicClient?: PublicClient;
    fuelAddress?: FuelAddress;
  };
};

export class BridgeService {
  static async bridge(input: BridgeInputs['bridge']) {
    const {
      fromNetwork,
      toNetwork,
      assetAmount,
      ethWalletClient,
      ethPublicClient,
      fuelAddress,
      fuelWallet,
      ethAddress,
      ethAsset,
    } = input;

    if (!fromNetwork || !toNetwork) {
      throw new Error('"Network From" and "Network To" are required');
    }
    if (!assetAmount || assetAmount.isZero()) {
      throw new Error('Need to inform amount to be transfered');
    }

    if (isEthChain(fromNetwork) && isFuelChain(toNetwork)) {
      if (!ethAsset) {
        throw new Error('Need to inform asset to be transfered');
      }

      const amountFormatted = assetAmount.format({
        precision: DECIMAL_UNITS,
        units: DECIMAL_UNITS,
      });
      const amountEthUnits = bn.parseUnits(amountFormatted, ethAsset.decimals);
      const txId = await TxEthToFuelService.start({
        amount: amountEthUnits.toHex(),
        ethWalletClient,
        fuelAddress,
        ethAsset,
        ethPublicClient,
      });

      if (txId) {
        store.openTxEthToFuel({
          txId,
        });
      }

      return;
    }

    if (isFuelChain(fromNetwork) && isEthChain(toNetwork)) {
      const txId = await TxFuelToEthService.create({
        amount: assetAmount,
        fuelWallet,
        ethAddress,
      });

      if (txId) {
        store.openTxFuelToEth({
          txId,
        });

        return;
      }
    }

    throw new Error(
      `Bridging from "${fromNetwork.name}" to "${toNetwork.name}" is not yet supported.`
    );
  }

  static async fetchTxs(input?: BridgeInputs['fetchTxs']): Promise<BridgeTx[]> {
    if (!input?.ethPublicClient) {
      throw new Error('Need to inform ethPublicClient');
    }
    if (!input?.fuelProvider) {
      throw new Error('Need to inform fuelProvider');
    }
    if (!input?.fuelAddress) {
      throw new Error('Need to inform fuelAddress');
    }

    const { fuelProvider, ethPublicClient, fuelAddress } = input;

    const [ethDepositLogs, fuelToEthTxs] = await Promise.all([
      TxEthToFuelService.fetchDepositLogs({ ethPublicClient, fuelAddress }),
      TxFuelToEthService.fetchTxs({ fuelAddress, fuelProvider }),
    ]);

    const fuelToEthBridgeTxs = fuelToEthTxs.map((tx) => ({
      txHash: tx.id || '',
      fromNetwork: FUEL_CHAIN,
      toNetwork: ETH_CHAIN,
      // TODO: remove this conversion when sdk already returns the date in unix format
      date: tx?.time ? new Date(fromTai64ToUnix(tx?.time) * 1000) : undefined,
    }));

    const ethToFuelBridgeTxs = await Promise.all(
      ethDepositLogs.map(async (log) => {
        const blockHash = log?.blockHash || '0x';

        const date = await getBlockDate({
          blockHash,
          publicClient: ethPublicClient,
        });

        return {
          txHash: log?.transactionHash || '0x',
          fromNetwork: ETH_CHAIN,
          toNetwork: FUEL_CHAIN,
          date,
        };
      })
    );

    // logic to merge txs and sort by date
    const allTxs = [
      ...(fuelToEthBridgeTxs || []),
      ...(ethToFuelBridgeTxs || []),
    ];
    const txs = allTxs.sort((a, b) => {
      if (!a?.date) {
        return 1;
      }
      if (!b?.date) {
        return -1;
      }
      return b.date.getTime() - a.date.getTime();
    });

    return txs || [];
  }
}
