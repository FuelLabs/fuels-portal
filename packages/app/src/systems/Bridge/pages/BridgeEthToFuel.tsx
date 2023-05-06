import { Stack } from '@fuel-ui/react';

import fuelLogoSrc from '../../../../public/fuel-logo.svg';

import { AccountConnectionInput } from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Stack gap="$4">
      <AccountConnectionInput
        networkName="Fuel"
        networkImageUrl={fuelLogoSrc}
        label="To"
        isConnecting={false}
        onConnect={() => {}}
      />
    </Stack>
  );
};
