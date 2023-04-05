import { Route } from 'react-router-dom';

import { Bridge } from './pages';
import { BridgeProvider } from './components/BridgeProvider';

import { Pages } from '~/types';

export const bridgeRoutes = (
  <Route
    path={Pages.bridge}
    element={
      <BridgeProvider>
        <Bridge />
      </BridgeProvider>
    }
  />
);
