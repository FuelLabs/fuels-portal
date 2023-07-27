import type { BridgeAsset } from '~/systems/Bridge';
import { db } from '~/systems/Core/utils/database';

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

  static async addAsset(input: { data: BridgeAsset }) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(input.data);
      return db.assets.get({ address: input.data.address });
    });
  }

  static async removeAsset({ address }: { address?: string }) {
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
}
