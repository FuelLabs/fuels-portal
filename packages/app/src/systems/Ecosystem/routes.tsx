import { Route } from 'react-router-dom';

import { Ecosystem } from './pages';

import { Pages } from '~/types';

export const ecosystemRoutes = (
  <Route path={Pages.ecosystem} element={<Ecosystem />} />
);
