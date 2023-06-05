import { Route } from 'react-router-dom';

import { BridgeHome, BridgeTxList, Bridge } from './pages';

import { Pages } from '~/types';

export const bridgeRoutes = (
  <>
    <Route
      path={Pages.bridge}
      element={
        <BridgeHome>
          <Bridge />
        </BridgeHome>
      }
    />
    <Route
      path={Pages.transactions}
      element={
        <BridgeHome>
          <BridgeTxList />
        </BridgeHome>
      }
    />
  </>
);
