import { useMutation } from '@tanstack/react-query';
import type { Provider } from '@ethersproject/providers';
import type { Wallet } from 'ethers';
import type { FuelWalletLocked } from '@fuel-wallet/sdk';
import { bn } from 'fuels';

import { FuelMessagePortal__factory } from '../../../types/fuel-v2-contracts/factories/FuelMessagePortal__factory';
import { ethers } from 'ethers';

export const useBridgeDeposit = (
  depositAmount: string,
  fromWallet?: Provider,
  toWallet?: false | FuelWalletLocked
) => {
  const mutation = useMutation(async () => {
    if (!fromWallet) {
      throw new Error('From Wallet not connected!');
    }

    if (!toWallet) {
      throw new Error('To Wallet not connected!');
    }

    console.log('from: ', fromWallet);

    const fuelPortal = FuelMessagePortal__factory.connect(
      process.env.VITE_FUEL_MESSAGE_PORTAL!,
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
