import { Stack } from '@fuel-ui/react';

import fuelLogoSrc from '../../../../public/fuel-logo.svg';

import {
  AccountConnectionInput,
  AccountConnectionEth,
} from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Stack gap="$4">
      <AccountConnectionEth />
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
