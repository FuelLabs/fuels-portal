import { bn } from 'fuels';
import { isAddress } from 'viem';
import type { PublicClient, WalletClient } from 'viem';
import type { BridgeAsset } from '~/systems/Bridge';
import { db } from '~/systems/Core/utils/database';

import { EthConnectorService } from './connectors';

export type AssetServiceInputs = {
  addAsset: { asset: BridgeAsset };
  removeAsset: { address?: string };
  faucetErc20: {
    address?: string;
    walletClient: WalletClient;
    publicClient: PublicClient;
  };
};

export class AssetService {
  static async upsertAsset(input: { data: BridgeAsset }) {
    return db.transaction('rw!', db.assets, async () => {
      const { address, ...updateData } = input.data;
      const asset = await db.assets.get({ address });
      if (asset) {
        await db.assets.update(address || '', updateData);
      } else {
        await db.assets.add(input.data);
      }

      return db.assets.get({ address });
    });
  }

  static async addAsset(input: AssetServiceInputs['addAsset']) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(input.asset);
      return db.assets.get({ address: input.asset.address });
    });
  }

  static async removeAsset({ address }: AssetServiceInputs['removeAsset']) {
    if (!isAddress(address || '')) {
      throw new Error('Invalid address');
    }
    return db.transaction('rw', db.assets, async () => {
      await db.assets.delete(address || '');

      return true;
    });
  }

  static async getAssets() {
    return db.transaction('r', db.assets, async () => {
      return db.assets.toArray();
    });
  }

  static async faucetErc20(input: AssetServiceInputs['faucetErc20']) {
    const { address, walletClient, publicClient } = input;

    if (!address || !isAddress(address || '')) {
      throw new Error('Invalid address');
    }
    if (!walletClient) {
      throw new Error('Missing wallet client');
    }
    if (!publicClient) {
      throw new Error('Missing public client');
    }

    const erc20 = EthConnectorService.connectToErc20({
      walletClient,
      address: address as `0x${string}`,
    });

    const erc20MintHash = await erc20.write.mint(
      [walletClient.account?.address, bn.parseUnits('1000000', 18)],
      {
        account: walletClient.account,
      }
    );

    await publicClient.waitForTransactionReceipt({
      hash: erc20MintHash,
    });
  }
}
