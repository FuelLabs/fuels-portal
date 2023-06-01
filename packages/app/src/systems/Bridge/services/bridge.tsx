import { bn, DECIMAL_UNITS } from 'fuels';
import type { Address as FuelAddress, BN } from 'fuels';
import type { PublicClient, WalletClient } from 'wagmi';

import { store } from '~/store';
import type { FromToNetworks } from '~/systems/Chains';
import {
  ETH_UNITS,
  isEthChain,
  isFuelChain,
  TxEthToFuelService,
} from '~/systems/Chains';

export type PossibleBridgeInputs = {
  assetAmount?: BN;
  ethSigner?: WalletClient;
  ethWalletClient?: WalletClient;
  ethPublicClient?: PublicClient;
  fuelAddress?: FuelAddress;
};
export type BridgeInputs = {
  bridge: FromToNetworks & PossibleBridgeInputs;
};

export class BridgeService {
  static async bridge(input: BridgeInputs['bridge']) {
    const {
      fromNetwork,
      toNetwork,
      assetAmount,
      fuelAddress,
      ethWalletClient,
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
        ethWalletClient,
        fuelAddress,
      });

      if (txId) {
        store.openTxEthToFuel({
          txId,
        });
      }

      return;
    }

    throw new Error(
      `Bridging from "${fromNetwork.name}" to "${toNetwork.name}" is not yet supported.`
    );
  }
}
