import { Route } from 'react-router-dom';

import { Bridge } from './pages';

import { Pages } from '~/types';

export const bridgeRoutes = <Route path={Pages.bridge} element={<Bridge />} />;
