import { createStore } from '@fuels-portal/store';

import type { StoreMachines } from './types';
import { Services } from './types';

import { bridgeMachine, bridgeEvents } from '~/systems/Bridge';
import {
  assetListMachine,
  ETH_UNITS,
  ethLogoSrc,
  assetListEvents,
} from '~/systems/Chains';
import { ecosystemMachine } from '~/systems/Ecosystem';
import { overlayMachine, overlayEvents } from '~/systems/Overlay';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.bridge, () => bridgeMachine)
  .addMachine(Services.ecosystem, () => ecosystemMachine)
  .addMachine(Services.assetList, () =>
    assetListMachine.withContext({
      assetList: [
        {
          decimals: ETH_UNITS,
          symbol: 'ETH',
          image: ethLogoSrc,
        },
      ],
    })
  )
  .addHandlers(overlayEvents)
  .addHandlers(bridgeEvents)
  .addHandlers(assetListEvents)
  .setup();

export const { StoreProvider } = store;
