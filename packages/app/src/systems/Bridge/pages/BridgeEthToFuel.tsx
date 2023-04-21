import { Card, Stack } from '@fuel-ui/react';

import ethLogoSrc from '../../../../public/eth-logo.svg';
import fuelLogoSrc from '../../../../public/fuel-logo.svg';
import { NetworkConnectCard } from '../components';

export const BridgeEthToFuel = () => {
  return (
    <Card>
      <Card.Body>
        <Stack gap="$4">
          <NetworkConnectCard
            networkName={'Ethereum'}
            networkImageUrl={ethLogoSrc}
            label={'From'}
            isConnecting={false}
            onConnect={() => {}}
          />
          <NetworkConnectCard
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
