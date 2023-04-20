import { Route } from 'react-router-dom';

import { Home } from '../Home';

import { Pages } from '~/types';

export const bridgeRoutes = <Route path={Pages.bridge} element={<Home />} />;
