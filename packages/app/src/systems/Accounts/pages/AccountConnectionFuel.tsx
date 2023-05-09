import fuelLogoSrc from '../../../../public/fuel-logo.svg';
import { AccountConnectionInput } from '../components';
import { useAccountConnectionFuel } from '../hooks';

export const AccountConnectionFuel = () => {
  const { isLoading, handlers, hasInstalledFuel, address } =
    useAccountConnectionFuel();
  const nonNullAddress = !address ? undefined : address!;

  return (
    <AccountConnectionInput
      networkName="Fuel"
      networkImageUrl={fuelLogoSrc}
      label="To"
      isConnecting={isLoading}
      onConnect={hasInstalledFuel ? handlers.connect : handlers.openFuelInstall}
      onDisconnect={handlers.disconnect}
      account={{ address: nonNullAddress }}
    />
  );
};
