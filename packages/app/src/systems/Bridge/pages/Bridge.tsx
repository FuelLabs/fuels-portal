import { Card } from '@fuel-ui/react';

import { BridgeEthToFuel } from './BridgeEthToFuel';

export const Bridge = () => {
  return (
    <Card>
      <Card.Body>
        {/* // TODO: here should put tabs (Deposit to Fuel) / (Withdraw from Fuel) */}
        <BridgeEthToFuel />
      </Card.Body>
    </Card>
  );
};
