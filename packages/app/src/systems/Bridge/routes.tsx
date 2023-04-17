import { Route } from 'react-router-dom';

import { Bridge } from './pages';
import { AccountProvider } from './providers';

import { Pages } from '~/types';

export const bridgeRoutes = (
  <Route
    path={Pages.bridge}
    element={
      <AccountProvider>
        <Bridge />
      </AccountProvider>
    }
  />
);
