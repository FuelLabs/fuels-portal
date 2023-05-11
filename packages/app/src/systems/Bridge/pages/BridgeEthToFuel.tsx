import { Box } from '@fuel-ui/react';

import {
  AccountConnectionEth,
  AccountConnectionFuel,
} from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Box.Stack gap="$4">
      <AccountConnectionEth />
      <AccountConnectionFuel />
    </Box.Stack>
  );
};
