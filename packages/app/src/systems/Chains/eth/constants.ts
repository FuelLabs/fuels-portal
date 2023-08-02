import { ethLogoSrc } from './utils';

import type { BridgeAsset } from '~/systems/Bridge';

export const AssetList: BridgeAsset[] = [
  {
    address: undefined,
    symbol: 'ETH',
    image: ethLogoSrc,
    decimals: 18,
  },
];
