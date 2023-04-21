import { Card, Stack } from '@fuel-ui/react';

import fuelLogoSrc from '../../../../public/fuel-logo.svg';

import {
  AccountConnectionEth,
  AccountConnectionInput,
} from '~/systems/Accounts';

export const BridgeEthToFuel = () => {
  return (
    <Card>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
};
