import { Button } from '@fuel-ui/react';

import { useBridgeButton } from '../hooks';

export const BridgeButton = () => {
  const { text, handlers, isLoading } = useBridgeButton();

  return (
    <Button onPress={handlers.action} isLoading={isLoading}>
      {text}
    </Button>
  );
};
