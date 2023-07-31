import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import { ecosystemRoutes } from './systems/Ecosystem/routes';
import { Pages } from './types';

export const routes = (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="*" element={<Navigate to={Pages.ecosystem} />} />
        {ecosystemRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);
