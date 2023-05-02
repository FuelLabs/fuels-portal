import { Button } from '@fuel-ui/react';

import { useBridge } from '../hooks';

export const BridgeButton = () => {
  // TODO: this button should start bridging, but also fire actions like: connect ETH account / connect Fuel account
  const { status, handlers } = useBridge();
  return (
    <Button onPress={handlers.startBridging}>{status || 'Nothing'}</Button>
  );
};
