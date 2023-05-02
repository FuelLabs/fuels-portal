import type { BN, WalletUnlocked } from 'fuels';
import { Provider, Wallet } from 'fuels';

import { FuelMessagePortal__factory } from './fuel-v2-contracts/factories/FuelMessagePortal__factory';

export type BridgeInputs = {
  bridge: {
    amount: BN;
    ethSigner: any;
  };
};

export class BridgeService {
  static async bridgeEthToFuel(input: BridgeInputs['bridge']) {
    if (!input.ethSigner) {
      throw new Error('Need to connect ETH Wallet');
    }

    // TODO: here should do from localhost:8080/deployments.local.json ID, but having cors issues
    // const response: {
    //   FuelMessagePortal: string;
    // } = await fetch('http://localhost:8080/deployments.local.json', {
    //   credentials: 'include',
    // }).then((res) => res.json());

    const fuelPortal = FuelMessagePortal__factory.connect(
      '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      // response.FuelMessagePortal,
      input.ethSigner
    );

    const fuelProvider = new Provider('http://localhost:4000/graphql');
    const fuelWallet: WalletUnlocked = Wallet.fromPrivateKey(
      '0x6303bacbe42085ab84211bba63f4946649bcfb81c30510cad46e6e4efbccbd72',
      fuelProvider
    );
    const tx = await fuelPortal.depositETH(fuelWallet.address.toHexString(), {
      value: input.amount.toHex(),
    });

    const result = await tx.wait();

    return result.transactionHash;
  }
}
