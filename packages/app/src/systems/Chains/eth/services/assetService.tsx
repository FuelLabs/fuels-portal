import type { Asset } from '../machines';

import { db } from '~/systems/Core/utils/database';

export class AssetService {
  static async upsertAsset(input: { data: Asset }) {
    return db.transaction('rw!', db.assets, async () => {
      const { assetId, ...updateData } = input.data;
      const asset = await db.assets.get({ assetId });
      if (asset) {
        await db.assets.update(assetId, updateData);
      } else {
        await db.assets.add(input.data);
      }

      return db.assets.get({ assetId });
    });
  }

  static async addAsset(input: { data: Asset }) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.add(input.data);
      return db.assets.get({ assetId: input.data.assetId });
    });
  }

  static async removeAsset({ assetId }: { assetId: string }) {
    return db.transaction('rw', db.assets, async () => {
      await db.assets.delete(assetId);

      return true;
    });
  }

  static async getAssets() {
    return db.transaction('r', db.assets, async () => {
      return db.assets.toArray();
    });
  }
}
