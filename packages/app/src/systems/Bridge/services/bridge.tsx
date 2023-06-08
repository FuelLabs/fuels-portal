import { bn, DECIMAL_UNITS } from 'fuels';
import type { BN } from 'fuels';

import { store } from '~/store';
import type {
  FromToNetworks,
  TxEthToFuelInputs,
  TxFuelToEthInputs,
} from '~/systems/Chains';
import {
  TxFuelToEthService,
  ETH_UNITS,
  isEthChain,
  isFuelChain,
  TxEthToFuelService,
} from '~/systems/Chains';

export type PossibleBridgeInputs = {
  assetAmount?: BN;
} & Omit<TxEthToFuelInputs['create'], 'amount'> &
  Omit<TxFuelToEthInputs['create'], 'amount'>;
export type BridgeInputs = {
  bridge: FromToNetworks & PossibleBridgeInputs;
};

export class BridgeService {
  static async bridge(input: BridgeInputs['bridge']) {
    const {
      fromNetwork,
      toNetwork,
      assetAmount,
      ethSigner,
      fuelAddress,
      fuelWallet,
      ethAddress,
    } = input;

    if (!fromNetwork || !toNetwork) {
      throw new Error('"Network From" and "Network To" are required');
    }

    if (!assetAmount || assetAmount.isZero()) {
      throw new Error('Need to inform asset amount to be transfered');
    }

    if (isEthChain(fromNetwork) && isFuelChain(toNetwork)) {
      const amountFormatted = assetAmount.format({
        precision: DECIMAL_UNITS,
        units: DECIMAL_UNITS,
      });
      const amountEthUnits = bn.parseUnits(amountFormatted, ETH_UNITS);
      const txId = await TxEthToFuelService.create({
        amount: amountEthUnits.toHex(),
        ethSigner,
        fuelAddress,
      });

      if (txId) {
        store.openTxEthToFuel({
          txId,
        });

        return;
      }
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
}
