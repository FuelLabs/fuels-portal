import {
  Route,
  Routes,
  Navigate,
  BrowserRouter,
  HashRouter,
} from 'react-router-dom';

import { bridgeRoutes } from './systems/Bridge/routes';
import { homeRoutes } from './systems/Home/routes';
import { Pages } from './types';

export const routes = (
  <HashRouter>
    <Routes>
      <Route>
        <Route path="*" element={<Navigate to={Pages.home} />} />
        {homeRoutes}
        {bridgeRoutes}
      </Route>
    </Routes>
  </HashRouter>
);
