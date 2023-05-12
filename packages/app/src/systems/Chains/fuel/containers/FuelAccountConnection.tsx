import { FUEL_CHAIN } from '../../config';
import { useFuelAccountConnection } from '../hooks';
import { fuelLogoSrc } from '../utils';

import { AccountConnectionInput } from '~/systems/Accounts';

export const FuelAccountConnection = ({ label }: { label?: string }) => {
  const {
    isConnecting,
    handlers,
    hasInstalledFuel,
    account: address,
  } = useFuelAccountConnection();

  return (
    <AccountConnectionInput
      networkName={FUEL_CHAIN.name}
      networkImageUrl={fuelLogoSrc}
      label={label}
      isConnecting={isConnecting}
      onConnect={hasInstalledFuel ? handlers.connect : handlers.openFuelInstall}
      onDisconnect={handlers.disconnect}
      account={{ address }}
    />
  );
};
