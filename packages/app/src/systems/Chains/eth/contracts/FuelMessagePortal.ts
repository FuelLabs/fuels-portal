import { FuelMessagePortal } from '@fuel-bridge/solidity-contracts';
import { bn } from 'fuels';

export type FuelMessagePortalArgs = {
  MessageSent: {
    amount: bigint;
    nonce: bigint;
    sender: `0x${string}`;
    recipient: `0x${string}`;
    data: `0x${string}`;
  };
};

export const decodeMessageSentData = {
  erc20Deposit: (data: `0x${string}`) => {
    const pattern =
      /^0x([A-f0-9]{64})([A-f0-9]{64})([A-f0-9]{64})([A-f0-9]{64})([A-f0-9]{64})$/;
    const match = data.match(pattern);
    const [, fuelTokenId, tokenId, sender, to, amount] = match || [];
    const parsed = {
      fuelTokenId: `0x${fuelTokenId}`,
      tokenId: `0x${tokenId}`,
      sender: `0x${sender}`,
      to: `0x${to}`,
      amount,
    };

    return parsed;
  },
};

export const FUEL_MESSAGE_PORTAL = {
  abi: FuelMessagePortal.abi,
};
