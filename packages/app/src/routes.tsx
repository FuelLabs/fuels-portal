import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { bridgeRoutes } from './systems/Bridge/routes';
import { Ecosystem } from './systems/Ecosystem';
import { ecosystemRoutes } from './systems/Ecosystem/routes';
import { homeRoutes } from './systems/Home/routes';

export const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="*" element={<Ecosystem />} />
        {homeRoutes}
        {bridgeRoutes}
        {ecosystemRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);
