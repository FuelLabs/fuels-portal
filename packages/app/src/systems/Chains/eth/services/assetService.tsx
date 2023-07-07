import type { Asset } from '../machines';

import { db } from '~/systems/Core/utils/database';

export class AssetService {
  static async addAsset(input: { data: Asset }) {
    return db.transaction('rw', db.assets, async () => {
      console.log(`input.data`, input.data);
      await db.assets.add(input.data);
      return db.assets.get({ assetId: input.data.assetId });
    });
  }

  static async getAssets() {
    return db.transaction('r', db.assets, async () => {
      return db.assets.toArray();
    });
  }
}
