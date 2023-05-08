import type { FromToNetworks } from '../utils';
import { isEthChain, isFuelChain } from '../utils';

import { store } from '~/store';
import type { TxEthToFuelInputs } from '~/systems/Chains';
import { TxEthToFuelService } from '~/systems/Chains';

export type PossibleBridgeInputs = Partial<TxEthToFuelInputs['create']>;
export type BridgeInputs = {
  bridge: FromToNetworks & PossibleBridgeInputs;
};

export class BridgeService {
  static async bridge(input: BridgeInputs['bridge']) {
    const { fromNetwork, toNetwork, amount, ethSigner } = input;

    if (!fromNetwork || !toNetwork) {
      throw new Error('"Network From" and "Network To" are required');
    }

    if (!amount || amount.isZero()) {
      throw new Error('Need to inform asset amount to be transfered');
    }

    if (isEthChain(fromNetwork) && isFuelChain(toNetwork)) {
      const txId = await TxEthToFuelService.create({
        amount,
        ethSigner,
      });

      store.openTxEthToFuel({
        txId,
      });
    }

    throw new Error('Bridge between this networks is not supported');
  }
}
