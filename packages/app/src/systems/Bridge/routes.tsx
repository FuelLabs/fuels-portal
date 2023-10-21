import { Route } from 'react-router-dom';
import { Pages } from '~/types';

import { BridgeHome, BridgeTxList, Bridge } from './pages';
import { Version } from './pages/Version';

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
    <Route path="version" element={<Version />} />
  </>
);
