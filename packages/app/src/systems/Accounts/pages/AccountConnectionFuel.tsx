import fuelLogoSrc from '../../../../public/fuel-logo.svg';
import { AccountConnectionInput } from '../components';

export const AccountConnectionFuel = () => {
  return (
    <AccountConnectionInput
      networkName="Fuel"
      networkImageUrl={fuelLogoSrc}
      label="To"
      isConnecting={false}
      onConnect={() => {}}
    />
  );
};
