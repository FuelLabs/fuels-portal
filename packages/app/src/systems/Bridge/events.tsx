import type { Store } from '../Store';
import { Services } from '../Store';

import type { BridgeInputs } from './services';
import type { FromToNetworks } from './utils';

export function bridgeEvents(store: Store) {
  return {
    changeNetworks(input: FromToNetworks) {
      store.send(Services.bridge, { type: 'CHANGE_NETWORKS', input });
    },
    startBridging(input: BridgeInputs['bridge']) {
      store.send(Services.bridge, { type: 'START_BRIDGING', input });
    },
  };
}
