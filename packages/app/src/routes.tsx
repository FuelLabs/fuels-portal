import {
  Route,
  HashRouter,
  Routes,
  Navigate,
  BrowserRouter,
} from 'react-router-dom';

import { bridgeRoutes } from './systems/Bridge/routes';
import { homeRoutes } from './systems/Home/routes';
import { Pages } from './types';

export const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="*" element={<Navigate to={Pages.home} />} />
        {homeRoutes}
        {bridgeRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);
