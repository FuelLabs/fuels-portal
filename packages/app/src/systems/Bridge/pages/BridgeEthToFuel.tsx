import { Stack } from '@fuel-ui/react';

import {
  AccountConnectionEth,
  AccountConnectionFuel,
} from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Stack gap="$4">
      <AccountConnectionEth />
      <AccountConnectionFuel />
    </Stack>
  );
};
