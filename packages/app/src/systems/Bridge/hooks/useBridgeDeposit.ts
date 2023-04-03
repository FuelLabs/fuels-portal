import { useMutation } from '@tanstack/react-query';
import type { Provider } from '@ethersproject/providers';
import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import { bn } from 'fuels';

import { FuelMessagePortal__factory } from '../../../types/fuel-v2-contracts/factories/FuelMessagePortal__factory';

export const useBridgeDeposit = (
  depositAmount: string,
  fromWallet?: Provider,
  toWallet?: false | FuelWalletLocked
) => {
  const mutation = useMutation(async () => {
    const response: {
      FuelMessagePortal: string;
    } = await fetch('http://localhost:8080/deployments.local.json', {
      headers: [
        ['Access-Control-Allow-Origin', '*'],
        ['Access-Control-Allow-Credentials', 'true'],
      ],
    }).then((res) => res.json());

    if (!fromWallet) {
      throw new Error('From Wallet not connected!');
    }

    if (!toWallet) {
      throw new Error('To Wallet not connected!');
    }

    const fuelPortal = FuelMessagePortal__factory.connect(
      response.FuelMessagePortal,
      fromWallet
    );

    // Parse 18 units of ETH
    const value = bn.parseUnits(depositAmount, 18).toHex();
    const tx = await fuelPortal.depositETH(toWallet.address.toHexString(), {
      value,
    });
    const result = await tx.wait();
    return result;
  });

  return mutation;
};
