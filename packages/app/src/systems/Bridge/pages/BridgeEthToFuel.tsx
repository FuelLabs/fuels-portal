import { Card, Stack } from '@fuel-ui/react';

import {
  AccountConnectionEth,
  AccountConnectionFuel,
} from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Card>
      <Card.Body>
        <Stack gap="$4">
          <AccountConnectionEth />
          <AccountConnectionFuel />
        </Stack>
      </Card.Body>
    </Card>
  );
};
