import LOGO from '../public/fuel-logo.png';
import { create } from '@storybook/theming/create';
const PRIMARY_COLOR = '#58C09B';

export default create({
  base: 'light',
  brandTitle: 'Fuel',
  brandImage: LOGO,
  colorPrimary: PRIMARY_COLOR,
  colorSecondary: PRIMARY_COLOR,
  barSelectedColor: PRIMARY_COLOR,
});
