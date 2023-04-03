import { Route } from 'react-router-dom';

import { Home } from './pages';

import { Pages } from '~/types';

export const homeRoutes = <Route path={Pages.home} element={<Home />} />;
