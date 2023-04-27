import type { Fuel } from '@fuel-wallet/sdk';

import type { Store } from '../Store';
import { Services } from '../Store';

export const fuelAccountEvents = (store: Store) => {
  return {
    walletDetected(value: Fuel) {
      store.send(Services.fuelAccount, { type: 'WALLET_DETECTED', value });
    },
    connect() {
      store.send(Services.fuelAccount, { type: 'CONNECT' });
    },
    disconnect() {
      store.send(Services.fuelAccount, { type: 'DISCONNECT' });
    },
  };
};
