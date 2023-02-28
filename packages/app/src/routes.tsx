import { Route, HashRouter, Routes } from 'react-router-dom';

import { Home } from './systems/Home';

export const routes = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </HashRouter>
);
