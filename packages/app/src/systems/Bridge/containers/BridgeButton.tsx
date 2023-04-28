import { Button } from '@fuel-ui/react';

import { useBridge } from '../hooks';

export const BridgeButton = () => {
  const { status } = useBridge();
  return <Button>{status || 'Nothing'}</Button>;
};
